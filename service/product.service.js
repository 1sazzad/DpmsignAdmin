"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_model_1 = __importDefault(require("../model/product.model"));
const product_attribute_model_1 = __importDefault(require("../model/product-attribute.model"));
const product_image_model_1 = __importDefault(require("../model/product-image.model"));
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const util_1 = require("../util");
const variation_model_1 = __importDefault(require("../model/variation.model"));
const variation_item_model_1 = __importDefault(require("../model/variation-item.model"));
const product_variant_model_1 = __importDefault(require("../model/product-variant.model"));
const product_variant_detail_model_1 = __importDefault(require("../model/product-variant-detail.model"));
const crypto_1 = __importDefault(require("crypto"));
const product_tags_model_1 = __importDefault(require("../model/product-tags.model"));
const product_review_model_1 = __importDefault(require("../model/product-review.model"));
const customer_model_1 = __importDefault(require("../model/customer.model"));
class ProductService {
    createProduct = async (name, description, basePrice, minOrderQuantity, discountStart, discountEnd, discountPercentage, pricingType, categoryId, isActive = true, attributes, tags, variations, variants) => {
        try {
            const product = await product_model_1.default.create({
                name,
                description,
                slug: (0, util_1.createSlug)(name),
                sku: await this.generateUniqueSKU(),
                basePrice,
                minOrderQuantity,
                discountStart,
                discountEnd,
                discountPercentage,
                pricingType,
                isActive,
                categoryId,
            });
            // Step 2: Create variations and their items
            if (variations.length > 0) {
                for (const variation of variations) {
                    const createdVariation = await variation_model_1.default.create({
                        name: variation.name,
                        unit: variation.unit,
                        productId: product.productId,
                    });
                    // Create variation items
                    if (variation?.variationItems?.length > 0) {
                        await variation_item_model_1.default.bulkCreate(variation.variationItems.map((item) => ({
                            value: item.value,
                            variationId: createdVariation.variationId,
                        })));
                    }
                }
            }
            // Step 3: Create product variants (provided by the frontend)
            if (variants.length > 0) {
                for (const variant of variants) {
                    const createdVariant = await product_variant_model_1.default.create({
                        additionalPrice: variant.additionalPrice,
                        productId: product.productId,
                    });
                    // Create product variant details
                    variant.variantDetails.map(async (detail) => {
                        // variationName, variationItemValue
                        const possibleVariation = await variation_model_1.default.findOne({
                            where: {
                                productId: product.productId,
                                name: detail.variationName,
                            },
                            include: [
                                { model: variation_item_model_1.default, as: "variationItems" },
                            ],
                        });
                        if (possibleVariation) {
                            const possibleVariationItem = possibleVariation
                                .toJSON()
                                .variationItems.filter((variationItem) => variationItem.value ===
                                detail.variationItemValue);
                            product_variant_detail_model_1.default.create({
                                variationItemId: possibleVariationItem[0].variationItemId,
                                productVariantId: createdVariant.productVariantId,
                            });
                        }
                    });
                }
            }
            if (tags.length > 0) {
                await product_tags_model_1.default.bulkCreate(tags.map((tag) => ({
                    tag: tag,
                    productId: product.productId,
                })));
            }
            if (attributes.length > 0) {
                await product_attribute_model_1.default.bulkCreate(attributes.map((attribute) => ({
                    property: attribute.property,
                    description: attribute.description,
                    productId: product.productId,
                })));
            }
            const createdProduct = await this.getProductById(product.productId);
            return createdProduct ? createdProduct : null;
        }
        catch (err) {
            console.log("Error occurred while creating product: ".red, err.message);
            throw err;
        }
    };
    createProductImage = async (imageName, productId) => {
        try {
            await product_image_model_1.default.create({ imageName, productId });
            return true;
        }
        catch (err) {
            console.log("Error occurred while creating product image: ".red, err.message);
            throw err;
        }
    };
    getProductById = async (productId) => {
        try {
            const product = await product_model_1.default.findByPk(productId, {
                include: [
                    {
                        model: product_attribute_model_1.default,
                        as: "attributes",
                        separate: true,
                    },
                    { model: product_tags_model_1.default, as: "tags", separate: true },
                    { model: product_image_model_1.default, as: "images", separate: true },
                    {
                        model: product_review_model_1.default,
                        as: "reviews",
                        separate: true,
                        include: [
                            {
                                model: product_model_1.default,
                                as: "product",
                                attributes: ["productId", "name"],
                            },
                            {
                                model: customer_model_1.default,
                                as: "customer",
                                attributes: ["customerId", "name", "email"],
                            },
                        ],
                    },
                    {
                        model: variation_model_1.default,
                        as: "variations",
                        separate: true,
                        include: [
                            {
                                model: variation_item_model_1.default,
                                as: "variationItems",
                                separate: true,
                            },
                        ],
                    },
                    {
                        model: product_variant_model_1.default,
                        as: "variants",
                        separate: true,
                        include: [
                            {
                                model: product_variant_detail_model_1.default,
                                as: "variantDetails",
                                separate: true,
                                include: [
                                    {
                                        model: variation_item_model_1.default,
                                        attributes: ["value"],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            if (!product)
                return null;
            return {
                ...product.toJSON(),
            };
        }
        catch (err) {
            console.log("Error occurred while fetching product by id: ".red, err.message);
            throw err;
        }
    };
    getRandomProducts = async (limit, excludeProductId) => {
        try {
            const products = await product_model_1.default.findAll({
                order: sequelize_typescript_1.Sequelize.literal("RAND()"),
                limit,
                where: {
                    productId: {
                        [sequelize_1.Op.ne]: excludeProductId,
                    },
                },
                include: [
                    {
                        model: product_attribute_model_1.default,
                        as: "attributes",
                        separate: true,
                    },
                    { model: product_tags_model_1.default, as: "tags", separate: true },
                    { model: product_image_model_1.default, as: "images", separate: true },
                    {
                        model: product_review_model_1.default,
                        as: "reviews",
                        separate: true,
                        include: [
                            {
                                model: product_model_1.default,
                                as: "product",
                                attributes: ["productId", "name"],
                            },
                            {
                                model: customer_model_1.default,
                                as: "customer",
                                attributes: ["customerId", "name", "email"],
                            },
                        ],
                    },
                    {
                        model: variation_model_1.default,
                        as: "variations",
                        separate: true,
                        include: [
                            {
                                model: variation_item_model_1.default,
                                as: "variationItems",
                                separate: true,
                            },
                        ],
                    },
                    {
                        model: product_variant_model_1.default,
                        as: "variants",
                        separate: true,
                        include: [
                            {
                                model: product_variant_detail_model_1.default,
                                as: "variantDetails",
                                separate: true,
                                include: [
                                    {
                                        model: variation_item_model_1.default,
                                        attributes: ["value"],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            if (products.length === 0) {
                return [];
            }
            return products.map((product) => product.toJSON());
        }
        catch (err) {
            console.log("Error occurred while getting random products: ".red, err.message);
            throw err;
        }
    };
    updateProduct = async (productId, name, description, basePrice, minOrderQuantity, discountStart, discountEnd, discountPercentage, pricingType, categoryId, isActive = true, attributes, tags, variations, variants) => {
        try {
            // Fetch the existing product with all associations
            const product = await product_model_1.default.findByPk(productId, {
                include: [
                    { model: product_attribute_model_1.default, as: "attributes" },
                    { model: product_tags_model_1.default, as: "tags" },
                    { model: product_image_model_1.default, as: "images" },
                    { model: product_review_model_1.default, as: "reviews" },
                    {
                        model: variation_model_1.default,
                        as: "variations",
                        include: [
                            { model: variation_item_model_1.default, as: "variationItems" },
                        ],
                    },
                    {
                        model: product_variant_model_1.default,
                        as: "variants",
                        include: [
                            {
                                model: product_variant_detail_model_1.default,
                                as: "variantDetails",
                                include: [
                                    {
                                        model: variation_item_model_1.default,
                                        attributes: ["value"],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            if (!product)
                return null;
            // Step 1: Update basic product information
            await product.update({
                name,
                description,
                slug: (0, util_1.createSlug)(name),
                basePrice,
                minOrderQuantity,
                discountStart,
                discountEnd,
                discountPercentage,
                pricingType,
                categoryId,
                isActive,
            });
            /*** Step 2: Handle Variations ***/
            const newVariationNames = variations.map((v) => v.name);
            // Delete removed variations
            for (const variation of product.variations ?? []) {
                if (!newVariationNames.includes(variation.name)) {
                    // Remove related variant details
                    await product_variant_detail_model_1.default.destroy({
                        where: {
                            variationItemId: variation.variationItems?.map((vi) => vi.variationItemId) ?? [],
                        },
                    });
                    // Remove variation items
                    await variation_item_model_1.default.destroy({
                        where: { variationId: variation.variationId },
                    });
                    // Remove the variation itself
                    await variation_model_1.default.destroy({
                        where: { variationId: variation.variationId },
                    });
                }
            }
            // Add or update variations and their items
            for (const variationInput of variations) {
                let existingVariation = await variation_model_1.default.findOne({
                    where: { productId, name: variationInput.name },
                    include: [{ model: variation_item_model_1.default, as: "variationItems" }],
                });
                if (!existingVariation) {
                    existingVariation = await variation_model_1.default.create({
                        name: variationInput.name,
                        unit: variationInput.unit,
                        productId,
                    });
                }
                else {
                    await existingVariation.update({
                        name: variationInput.name,
                        unit: variationInput.unit,
                    });
                }
                // Safely get existing items array
                const items = existingVariation.variationItems ?? [];
                const existingValues = items.map((item) => item.value);
                const newValues = variationInput.variationItems.map((item) => item.value);
                // Delete removed items
                for (const item of items) {
                    if (!newValues.includes(item.value)) {
                        await product_variant_detail_model_1.default.destroy({
                            where: { variationItemId: item.variationItemId },
                        });
                        await variation_item_model_1.default.destroy({
                            where: { variationItemId: item.variationItemId },
                        });
                    }
                }
                // Add new items
                for (const itemInput of variationInput.variationItems) {
                    if (!existingValues.includes(itemInput.value)) {
                        await variation_item_model_1.default.create({
                            variationId: existingVariation.variationId,
                            value: itemInput.value,
                        });
                    }
                }
            }
            /*** Step 3: Handle Variants ***/
            const existingVariants = (product.variants ?? []).map((v) => ({
                productVariantId: v.productVariantId,
                variantDetails: v.variantDetails.map((d) => ({
                    variationName: product.variations?.find((variation) => variation.variationItems?.some((item) => item.variationItemId === d.variationItemId))?.name ?? "",
                    variationItemValue: d.variationItem?.value,
                })),
            }));
            const existingHashes = new Set(existingVariants.map((v) => JSON.stringify(v.variantDetails)));
            const newHashes = new Set(variants.map((v) => JSON.stringify(v.variantDetails)));
            // Delete removed variants
            for (const variant of existingVariants) {
                const hash = JSON.stringify(variant.variantDetails);
                if (!newHashes.has(hash)) {
                    await product_variant_detail_model_1.default.destroy({
                        where: { productVariantId: variant.productVariantId },
                    });
                    await product_variant_model_1.default.destroy({
                        where: { productVariantId: variant.productVariantId },
                    });
                }
                else {
                    // Update existing variant additionalPrice
                    const variantToUpdate = variants.find((v) => JSON.stringify(v.variantDetails) === hash);
                    if (variantToUpdate) {
                        await product_variant_model_1.default.update({
                            additionalPrice: variantToUpdate.additionalPrice,
                        }, {
                            where: {
                                productVariantId: variant.productVariantId,
                            },
                        });
                    }
                }
            }
            // Add new variants
            for (const variantInput of variants) {
                const hash = JSON.stringify(variantInput.variantDetails);
                if (!existingHashes.has(hash)) {
                    const created = await product_variant_model_1.default.create({
                        additionalPrice: variantInput.additionalPrice,
                        productId,
                    });
                    // Link variant details
                    for (const detail of variantInput.variantDetails) {
                        const variation = await variation_model_1.default.findOne({
                            where: { productId, name: detail.variationName },
                            include: [
                                { model: variation_item_model_1.default, as: "variationItems" },
                            ],
                        });
                        const variationItem = variation?.variationItems?.find((v) => v.value === detail.variationItemValue);
                        if (variationItem) {
                            await product_variant_detail_model_1.default.create({
                                productVariantId: created.productVariantId,
                                variationItemId: variationItem.variationItemId,
                            });
                        }
                    }
                }
            }
            /*** Step 4: Handle Tags ***/
            const existingTags = (product.tags ?? []).map((t) => t.tag);
            const newTagsSet = new Set(tags);
            for (const tag of existingTags) {
                if (!newTagsSet.has(tag)) {
                    await product_tags_model_1.default.destroy({ where: { productId, tag } });
                }
            }
            for (const tag of tags) {
                if (!existingTags.includes(tag)) {
                    await product_tags_model_1.default.create({ productId, tag });
                }
            }
            /*** Step 5: Handle Attributes ***/
            const existingAttrs = (product.attributes ?? []).map((a) => a.property);
            const newAttrsSet = new Set(attributes.map((a) => a.property));
            for (const prop of existingAttrs) {
                if (!newAttrsSet.has(prop)) {
                    await product_attribute_model_1.default.destroy({
                        where: { productId, property: prop },
                    });
                }
            }
            for (const attrInput of attributes) {
                if (!existingAttrs.includes(attrInput.property)) {
                    await product_attribute_model_1.default.create({
                        productId,
                        property: attrInput.property,
                        description: attrInput.description,
                    });
                }
                else {
                    await product_attribute_model_1.default.update({ description: attrInput.description }, { where: { productId, property: attrInput.property } });
                }
            }
            // Return the updated product
            const updatedProduct = await this.getProductById(productId);
            return updatedProduct ? updatedProduct : null;
        }
        catch (err) {
            console.error("Error occurred while updating product:", err.message);
            throw err;
        }
    };
    getProductImagesByProductId = async (productId) => {
        try {
            const images = await product_image_model_1.default.findAll({
                where: { productId },
            });
            if (images.length === 0) {
                return null;
            }
            return images;
        }
        catch (err) {
            console.log("Error occurred while getting product images by product id: "
                .red, err.message);
            throw err;
        }
    };
    deleteProductImage = async (imageId) => {
        try {
            const image = await product_image_model_1.default.findByPk(imageId);
            if (!image) {
                return false;
            }
            await product_image_model_1.default.destroy({ where: { imageId } });
            return true;
        }
        catch (err) {
            console.log("Error occured while deleting product image: ".red, err.message);
            throw err;
        }
    };
    deleteProduct = async (productId) => {
        try {
            const product = await product_model_1.default.findByPk(productId, {
                include: [
                    { model: product_attribute_model_1.default, as: "attributes" },
                    { model: product_tags_model_1.default, as: "tags" },
                    { model: product_image_model_1.default, as: "images" },
                    { model: product_review_model_1.default, as: "reviews" },
                    {
                        model: variation_model_1.default,
                        as: "variations",
                        include: [
                            { model: variation_item_model_1.default, as: "variationItems" },
                        ],
                    },
                    {
                        model: product_variant_model_1.default,
                        as: "variants",
                        include: [
                            {
                                model: product_variant_detail_model_1.default,
                                as: "variantDetails",
                            },
                        ],
                    },
                ],
            });
            if (!product) {
                return false;
            }
            // Deleting ProductVariants first (to prevent foreign key issues)
            if (product.variants.length > 0) {
                await Promise.all(product.variants.map(async (variant) => {
                    await Promise.all(variant.variantDetails.map(async (detail) => product_variant_detail_model_1.default.destroy({
                        where: {
                            productVariantDetailId: detail.productVariantDetailId,
                        },
                    })));
                    await product_variant_model_1.default.destroy({
                        where: {
                            productVariantId: variant.productVariantId,
                        },
                    });
                }));
            }
            // Deleting Variations and their Items
            if (product.variations.length > 0) {
                await Promise.all(product.variations.map(async (variation) => {
                    await Promise.all(variation.variationItems.map(async (item) => variation_item_model_1.default.destroy({
                        where: {
                            variationItemId: item.variationItemId,
                        },
                    })));
                    await variation_model_1.default.destroy({
                        where: { variationId: variation.variationId },
                    });
                }));
            }
            // Deleting Attributes, Tags, Images, Reviews
            await Promise.all([
                product_attribute_model_1.default.destroy({ where: { productId } }),
                product_tags_model_1.default.destroy({ where: { productId } }),
                product_image_model_1.default.destroy({ where: { productId } }),
                product_review_model_1.default.destroy({ where: { productId } }),
            ]);
            // Finally, delete the Product
            await product.destroy();
            return true;
        }
        catch (err) {
            console.log("Error occurred while deleting product: ".red, err.message);
            throw err;
        }
    };
    activeProduct = async (productId) => {
        try {
            const product = await product_model_1.default.findOne({
                where: { productId },
            });
            if (product) {
                product.isActive = true;
                await product.save();
                return product.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while activating product: ".red, err.message);
            throw err;
        }
    };
    inactiveProduct = async (productId) => {
        try {
            const product = await product_model_1.default.findOne({
                where: { productId },
            });
            if (product) {
                product.isActive = false;
                await product.save();
                return product.toJSON();
            }
            return null;
        }
        catch (err) {
            console.log("Error occured while inactivating product: ".red, err.message);
            throw err;
        }
    };
    getAllProducts = async (filter, limit, offset, order) => {
        try {
            const products = await product_model_1.default.findAll({
                where: filter,
                limit,
                offset,
                order,
                subQuery: false,
                include: [
                    {
                        model: product_attribute_model_1.default,
                        as: "attributes",
                        separate: true,
                    },
                    {
                        model: product_tags_model_1.default,
                        as: "tags",
                        separate: true,
                    },
                    {
                        model: product_image_model_1.default,
                        as: "images",
                        separate: true,
                    },
                    {
                        model: product_review_model_1.default,
                        as: "reviews",
                        separate: true,
                        include: [
                            {
                                model: product_model_1.default,
                                as: "product",
                                attributes: ["productId", "name"],
                            },
                            {
                                model: customer_model_1.default,
                                as: "customer",
                                attributes: ["customerId", "name", "email"],
                            },
                        ],
                    },
                    {
                        model: variation_model_1.default,
                        as: "variations",
                        separate: true,
                        include: [
                            {
                                model: variation_item_model_1.default,
                                as: "variationItems",
                                separate: true,
                            },
                        ],
                    },
                    {
                        model: product_variant_model_1.default,
                        as: "variants",
                        separate: true,
                        include: [
                            {
                                model: product_variant_detail_model_1.default,
                                as: "variantDetails",
                                separate: true,
                                include: [
                                    {
                                        model: variation_item_model_1.default,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            // Get total count separately
            const count = await product_model_1.default.count({ where: filter });
            return {
                rows: products.map((product) => product.toJSON()),
                count,
            };
        }
        catch (err) {
            console.log("Error occurred while fetching products: ".red, err.message);
            throw err;
        }
    };
    addProductImage = async (imageName, productId) => {
        try {
            await product_image_model_1.default.create({ imageName, productId });
            return true;
        }
        catch (err) {
            console.log("Error occurred while adding product image: ".red, err.message);
            throw err;
        }
    };
    removeProductImage = async (imageId) => {
        try {
            const image = await product_image_model_1.default.findByPk(imageId);
            if (image) {
                await image.destroy();
                return true;
            }
            return false;
        }
        catch (err) {
            console.log("Error occurred while deleting product image: ".red, err.message);
            throw err;
        }
    };
    generateUniqueSKU = async () => {
        let sku;
        let exists;
        do {
            const randomString = crypto_1.default
                .randomBytes(3)
                .toString("hex")
                .toUpperCase()
                .slice(0, 6);
            sku = `DPM-${randomString}`;
            exists = await product_model_1.default.findOne({ where: { sku } });
        } while (exists);
        return sku;
    };
}
exports.default = ProductService;
