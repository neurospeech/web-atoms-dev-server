import { readdirSync, statSync, readFileSync, watch } from "fs";
import md5 from "md5";

export default class FolderWatcher {

    /**
     * Store md5 of previous files...
     */
    private files: { [key: string]: string } = {};

    private watch: any;

    /**
     *
     */
    constructor(
        private readonly path: string,
        private readonly callback: () => void) {
        this.readFiles(path);
        this.watch = watch(
            path,
            { recursive: true },
            (e, filename) => {
                this.onFileChange(filename);
        });
    }

    public close(): void {
        if (this.watch) {
            this.watch.close();
        }
    }

    private onFileChange(filename: string): void {
        const old = this.files[filename];
        if (old) {
            const n = md5(readFileSync(filename));
            if (n === old) {
                return;
            }
        }
        this.callback();
    }

    private readFiles(path: string): void {
        const files = readdirSync(path);
        for (const iterator of files) {
            const s = statSync(iterator);
            if (s.isDirectory()) {
                this.readFiles(iterator);
            } else {
                this.files[iterator] = md5(readFileSync(iterator));
            }
        }
    }

}
