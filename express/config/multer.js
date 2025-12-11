import multer from 'multer'
import path from 'path'

const brand = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/brands/");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const name = String(req.body.name).toLowerCase().replace(/\s+/g, "-");
        cb(null, `${name}${ext}`);
    }
});

const product = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/products/");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const name = String(req.body.title).toLowerCase().replace(/\s+/g, "-");
        cb(null, `${Date.now()}-${name}${ext}`);
    }
});

export const uploadBrand = multer({ storage: brand });
export const uploadProduct = multer({ storage: product });