import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Buffer } from 'buffer';
import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { decode } from 'jpeg-js';
import type { Prediction } from '../models/Emoji';

const manifest = require('../assets/mobilenet/model.json');
const weightModules = [
  require('../assets/mobilenet/group1-shard1of2.bin'),
  require('../assets/mobilenet/group1-shard2of2.bin'),
];
let loadingModel: Promise<mobilenet.MobileNet> | undefined;

// Shares one model between rounds and permits retry after a failed load.
export function loadClassifier(): Promise<mobilenet.MobileNet> {
  if (!loadingModel) {
    // Clears a failed attempt so the Retry button can start a fresh load.
    loadingModel = initializeClassifier().catch((error) => {
      loadingModel = undefined;
      throw error;
    });
  }
  return loadingModel;
}

// Registers the runtime services TF.js needs in Hermes and loads the bundled weights.
async function initializeClassifier(): Promise<mobilenet.MobileNet> {
  tf.env().setPlatform('react-native', {
    fetch: globalThis.fetch,
    // Uses a high-resolution monotonic clock for inference.
    now: () => performance.now(),
    // Encodes strings for TF.js weight and tensor utilities.
    encode: (value, encoding) => Uint8Array.from(Buffer.from(value, encoding)),
    // Decodes strings from TF.js byte arrays.
    decode: (bytes, encoding) => Buffer.from(bytes).toString(encoding),
    // Recognizes the numeric typed arrays supported by TF.js tensors.
    isTypedArray: (value) => value instanceof Float32Array || value instanceof Int32Array
      || value instanceof Uint8Array || value instanceof Uint8ClampedArray,
  });
  await tf.setBackend('cpu');
  const assets = await Asset.loadAsync(weightModules);
  const shards: Uint8Array[] = [];
  for (const asset of assets) {
    if (!asset.localUri) throw new Error('MobileNet weight asset is missing.');
    shards.push(await new File(asset.localUri).bytes());
  }
  const weights = new Uint8Array(shards[0].length + shards[1].length);
  weights.set(shards[0]);
  weights.set(shards[1], shards[0].length);

  return mobilenet.load({
    version: 2,
    alpha: 0.5,
    inputRange: [0, 1],
    modelUrl: tf.io.fromMemory({
      modelTopology: manifest.modelTopology,
      weightSpecs: manifest.weightsManifest[0].weights,
      weightData: weights.buffer,
    }),
  });
}

// Resizes and classifies a camera frame, then releases its tensor and temporary files.
export async function classifyFrame(model: mobilenet.MobileNet, uri: string): Promise<Prediction[]> {
  let resizedUri: string | undefined;
  let tensor: tf.Tensor3D | undefined;
  try {
    const resized = await ImageManipulator.manipulate(uri)
      .resize({ width: 224, height: 224 })
      .renderAsync();
    const jpeg = await resized.saveAsync({ format: SaveFormat.JPEG });
    resizedUri = jpeg.uri;
    const { width, height, data } = decode(await new File(jpeg.uri).bytes(), { useTArray: true });
    const rgb = new Uint8Array(width * height * 3);
    for (let source = 0, target = 0; source < data.length; source += 4) {
      rgb[target++] = data[source];
      rgb[target++] = data[source + 1];
      rgb[target++] = data[source + 2];
    }
    tensor = tf.tensor3d(rgb, [height, width, 3], 'int32');
    return await model.classify(tensor);
  } finally {
    tensor?.dispose();
    if (resizedUri && resizedUri !== uri) removeTemporaryFrame(resizedUri);
    removeTemporaryFrame(uri);
  }
}

// Removes an app-created cache file without masking a classification error.
function removeTemporaryFrame(uri: string) {
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch (error) {
    if (__DEV__) console.warn('Could not clear the camera cache file:', error);
  }
}
