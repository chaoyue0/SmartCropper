/**
 * File: picture.ts
 * Description: Create a new cropper that the portal for uploading local images.
 * Author: buxuewushu
 * Date: 2024-12-2
 *
 */
class Picture {
    /**
     * @param { number } [width] - The Picture width.
     * @param { number } [height] - The Picture height.
     * @param { HTMLImageElement } [image] - The Image object.
     */
    width: number
    height: number
    image: HTMLImageElement

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
        this.image = new Image()
    }

    init() {
        const imageInput: HTMLElement | null = document.querySelector('#imageFile')
        const canvas: HTMLCanvasElement | null = document.querySelector('#canvas-picture')
        if (canvas) canvas.style.display = 'none'
        if (imageInput) {
            // Change the pointer of this,make sure "this.image" is not undefined
            imageInput.addEventListener('change', (event: Event) => this.handleFileChange(event), false)
        }
    }

    handleFileChange(event: Event) {
        const imgFileList = (event.target as HTMLInputElement).files
        if (imgFileList && imgFileList.length > 0) {
            const reader = new FileReader()
            reader.readAsDataURL(imgFileList[0])

            reader.onload = (progressEvent: ProgressEvent<FileReader>) => {
                const imgSrc: string | ArrayBuffer | null = (progressEvent.target as FileReader).result
                this.image.src = typeof imgSrc === 'string' ? imgSrc : ''

                this.image.onload = () => {
                    this.image.width = this.width
                    this.image.height = this.height
                    this.drawCanvas()
                }
            }
        }
    }

    drawCanvas() {
        const picture: HTMLElement | null = document.querySelector('.cropper-picture')
        if (picture) {
            const canvas: HTMLCanvasElement | null = document.querySelector('#canvas-picture')
            if (canvas) {
                const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
                if (ctx && this.image) {
                    this.generateCanvas(canvas, this.image.width, this.image.height)
                    ctx.drawImage(this.image, 0, 0, this.width, this.height)
                }
            }
        }
    }

    generateCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
        canvas.style.display = 'block'
        canvas.width = width
        canvas.height = height
    }

    getImage() {
        return this.image
    }
}

export default Picture
