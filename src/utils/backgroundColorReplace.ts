import { kmeans } from 'ml-kmeans';

const useBrowserKmeans = async (vectors: number[][], k: number = 4) => {
    try {
        const result = kmeans(vectors, k);
        return {
            clusters: result.clusters,
            centroids: result.centroids,
            iterations: result.iterations
        };
    } catch (error) {
        throw new Error(`K-means clustering failed: ${error.message}`);
    }
};

const backgroundColorReplace = (picture?: any, color?: string) => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const image = new Image();
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas)
    image.src = URL.createObjectURL(file);
    image.onload = async () => {
        console.log('图片已加载', image);
        canvas.width = image.width;
        canvas.height = image.height;
        console.log('image', image.src);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log('imageData', imageData);
        console.log('transition', transition(imageData.data));
        const result = await useBrowserKmeans(transition(imageData.data));
        console.log('result', result);
        const target = result.centroids.find(x => x.clusterInd.includes(0));
    }

    image.onerror = () => {
        console.error("图片加载失败！路径:", image.src);
    };
}

export const toBase64 = (imageData, w, h) => {
    imageData = imageData.flat(1);
    const canvas = document.createElement('canvas');
    [canvas.width, canvas.height] = [w, h];
    const ctx = canvas.getContext('2d');
    const _imageData = ctx.createImageData(w, h);
    if (_imageData.data.set) {
        _imageData.data.set(imageData);
    } else {
        // IE9
        imageData.forEach(function (val, i) {
            _imageData.data[i] = val;
        });
    }
    ctx.putImageData(_imageData, 0, 0);
    return canvas.toDataURL();
};

// 将imageData转成一个像素点的二维数组
const transition = (imageData: any) => {
    const ret = [];
    for (let i = 0; i < imageData.length; i += 4) {
        ret.push([imageData[i], imageData[i + 1], imageData[i + 2], imageData[i + 3]]);
    }
    return ret;
};

function isBackground(r: number, g: number, b: number) {
    const [h] = rgbToHsv(r, g, b);
    return (h >= 200 && h <= 260); // 蓝色背景范围
}

/**
 * 将RGB颜色值转换为HSV颜色空间
 *
 * @param {number} r - 红色分量 (0-255)
 * @param {number} g - 绿色分量 (0-255)
 * @param {number} b - 蓝色分量 (0-255)
 * @returns {number[]} [h, s, v] 数组 - 色调(0-360), 饱和度(0-1), 明度(0-1)
 */
function rgbToHsv(r: number, g: number, b: number) {
    // 将RGB分量归一化到[0, 1]范围
    r = r / 255;
    g = g / 255;
    b = b / 255;

    // 计算最大值、最小值和差值
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0; // 色调 (0-360)
    let s = 0; // 饱和度 (0-1)
    const v = max; // 明度 (0-1)

    // 计算饱和度 (如果最大值不为0)
    if (max !== 0) {
        s = delta / max;
    }

    // 计算色调 (如果颜色不是灰色)
    if (delta !== 0) {
        switch(max) {
            case r:
                h = ((g - b) / delta) * 60;
                if (h < 0) h += 360;
                break;
            case g:
                h = ((b - r) / delta) * 60 + 120;
                break;
            case b:
                h = ((r - g) / delta) * 60 + 240;
                break;
        }
    }

    // 确保色调在0-360度范围内
    if (h >= 360) h -= 360;
    if (h < 0) h += 360;

    return [h, s, v];
}

export default backgroundColorReplace;
