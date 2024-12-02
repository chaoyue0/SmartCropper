export const crop = () => {
    const canvas: HTMLCanvasElement = document.createElement("canvas")
    canvas.width = 300
    canvas.height = 300
    const container: HTMLElement | null = document.querySelector('.cropper-container')
    container?.append(canvas)
    if (canvas.getContext) {
        let ctx = canvas.getContext("2d")
        if (ctx) {
            ctx.fillRect(25, 25, 100, 100)
            ctx.clearRect(45, 45, 60, 60)
            ctx.strokeRect(50, 50, 50, 50)
            // const picture = document.querySelector('.cropper-picture')
            // const img = picture ? picture.children[0] : undefined
            // const image = new Image()
            // image.src = img?.getAttribute('src') ||  ''
            // if (image) {
            //     ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
            // }
        }
    }

}
