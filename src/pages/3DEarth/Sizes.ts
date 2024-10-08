
export class Sizes {
    private dom: HTMLDivElement;
    public viewport: { width: number, height: number };
    private resizeListeners: (() => void)[];
    private resizeObserver: ResizeObserver;

    constructor(options: { dom: HTMLDivElement }) {
        this.dom = options.dom;
        this.viewport = {
            width: 0,
            height: 0
        };

        this.resizeListeners = [];  // 用于存储监听器函数

        this.updateSizes();

        // 使用 ResizeObserver 监听 DOM 尺寸变化
        this.resizeObserver = new ResizeObserver(() => {
            this.updateSizes();
            this.emitResize();
        });

        this.resizeObserver.observe(this.dom);
    }

    updateSizes() {
        this.viewport.width = this.dom.clientWidth;
        this.viewport.height = this.dom.clientHeight;
    }

    $on(eventName: string, listener: () => void) {
        if (eventName === 'resize') {
            this.resizeListeners.push(listener);  // 将监听器函数添加到数组中
        }
    }

    emitResize() {
        // 触发所有的'resize'监听器
        this.resizeListeners.forEach(listener => listener());
    }
}