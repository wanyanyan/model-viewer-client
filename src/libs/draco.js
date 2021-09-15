/**
* Copyright (c) 2014-present, Facebook, Inc.
* All rights reserved.
*/

import childProcess from 'child_process'
import fs from 'fs'
import path from 'path'


/**
 * Converts an FBX to a GTLF or GLB file.
 * @param string srcFile path to the source file.
 * @param string destFile path to the destination file.
 * This must end in `.glb` or `.gltf` (case matters).
 * @param string[] [opts] options to pass to the converter tool.
 * @return Promise<string> a promise that yields the full path to the converted
 * file, an error on conversion failure.
 */
function encode(srcFile, destFile, opts = []) {
  return new Promise((resolve, reject) => {
    try {
      let tool = path.join(__dirname, 'draco', 'draco_encoder.exe');
      if (!fs.existsSync(tool)) {
        throw new Error(`No Convert Tool: ${tool}`);
      }

      let destExt = '.drc';
      let srcPath = fs.realpathSync(srcFile);
      let destDir = fs.realpathSync(path.dirname(destFile));
      let destPath = path.join(destDir, path.basename(destFile, destExt));

      let args = opts.slice(0);
      args.push("-i", srcPath, "-o", destPath + destExt);
      let child = childProcess.spawn(tool, args);

      let output = '';
      child.stdout.on('data', (data) => output += data);
      child.stderr.on('data', (data) => output += data);
      child.on('error', reject);
      child.on('close', code => {
        // non-zero exit code is failure
        if (code != 0) {
          reject(new Error(`Converter output:\n` +
                           (output.length ? output : "<none>")));
        } else {
          resolve(destPath + destExt);
        }
      });

    } catch (error) {
      reject(error);
    }
  });
}

export default {
  encode
};
