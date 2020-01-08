import { Dirent , readdirSync } from 'fs';
import path                     from 'path';
import { DynamicModule }        from '@nestjs/common';

export default function readDir(pathDir: string = __dirname): DynamicModule [] {
  return getDirectories(pathDir)
      .map(({ name }) => ({ dir: name, files: readdirSync(path.join(pathDir, name)) }))
      .map(({ files, dir }) => ({ dir, files: getModuleFiles(files) }))
      .map(({ files, dir }) => files.map(file => convertToDynamicModule(pathDir, dir, file)))
      .filter(module => module.length)
      .map(module => Object.values(module[0]))
      .reduce((acc, cur) => acc.concat(cur), []);
}

function convertToDynamicModule(pathDir, dir, file) : DynamicModule {
  return require(path.join(pathDir, dir, file)) as DynamicModule;
}

function getModuleFiles(files: string []) : string [] {
  return files.filter(file => file.endsWith('module.ts') || file.endsWith('module.js'));
}

function getDirectories(path: string) : Dirent [] {
  return readdirSync(path, { withFileTypes: true })
        .filter((file: Dirent) => file.isDirectory());
}
