import { Command, flags } from "@oclif/command";
import * as fs from "fs";
import * as path from "path";
import * as mkdirp from "mkdirp";

const createFile = (filename: string) =>
  new Promise((resolve, reject) => {
    const time = new Date();
    fs.utimes(filename, time, time, (err) => {
      if (err) {
        reject(err);
        fs.open(filename, "w", (err, fd) => {
          if (err) reject(err);
          fs.close(fd, (err) => {
            if (err) reject(err);
          });
        });

      }
      resolve(filename);
    });
  });

class Cli extends Command {
  static description =
    "this tiny cli creates one empty file and it's underling directories if the don't exists.";

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    absolute: flags.boolean({ char: "a" }),
  };

  static args = [
    {
      name: "file",
      required: true, // make the arg required with `required: true`
      description: "path and file to create", // help description
    },
  ];

  async run() {
    const { args, flags } = this.parse(Cli);

    this.log(`name of the file to create ${args.file}`);

    const normalizedPath = path.normalize(args.file);

    if (path.isAbsolute(normalizedPath) && !flags.absolute) {
      this.log(
        "If you want to create a file with an absolute path use the --absolute or -a flag"
      );
    } else {
      const { dir } = path.parse(normalizedPath);
      await mkdirp.native(dir);

      await createFile(normalizedPath);
    }
  }
}

export = Cli;
