import { Tag } from "@db/models"

export const create_tag_defaults = async () => {
    const default_categories = [
        { name: 'Digital Art', identifier: 'digital_art', color: 'blue' },
        { name: 'Traditional', identifier: 'traditional', color: 'green' },
        { name: 'Photography', identifier: 'photography', color: 'violet' },
        { name: 'Animation', identifier: 'animation', color: 'cyan' },
    ]

    const default_tags = [
        { name: 'Painting', identifier: 'painting', color: '', categories: [ 'Digital Art', 'Traditional' ] },
        { name: 'Abstract', identifier: 'abstract', color: '', categories: [ 'Digital Art', 'Traditional', 'Photography', 'Animation' ] },
        { name: 'Portrait', identifier: 'portrait', color: '', categories: [ 'Digital Art', 'Traditional', 'Photography' ] },
        { name: 'Typographic', identifier: 'typographic', color: '', categories: [ 'Digital Art', 'Traditional' ] },
        { name: 'Graphic', identifier: 'graphic', color: '', categories: [ 'Digital Art', 'Animation' ] },
        { name: 'Photorealistic', identifier: 'photorealistic', color: '', categories: [ 'Digital Art', 'Traditional'] },
        { name: 'Illustration', identifier: 'illustration', color: '', categories: [ 'Digital Art', 'Traditional' ] },
        { name: 'Furry', identifier: 'furry', color: '', categories: [ 'Digital Art', 'Traditional' ] },
        { name: 'Cover', identifier: 'cover', color: '', categories: [ 'Digital Art', 'Traditional' ] },
        { name: 'Mature', identifier: 'mature', color: 'red', special: true },
        { name: 'Explicit', identifier: 'explicit', color: 'red', special: true },
        { name: 'NSFW', identifier: 'nsfw', color: '', special: true },
        { name: 'Anime', identifier: 'anime', color: '', categories: [ 'Digital Art', 'Traditional', 'Animation' ] },
        { name: 'Comic', identifier: 'comic', color: '', categories: [ 'Digital Art', 'Traditional' ] },
        { name: 'Cartoon', identifier: 'cartoon', color: '', categories: [ 'Digital Art', 'Traditional', 'Animation' ] },
        { name: 'Concept', identifier: 'concept', color: '', categories: [ 'Digital Art' ] },
    ]

    for (let ts of [default_categories, default_tags]) {
        for (let t of ts) {
            await Tag.findOne({ name: t.name }).then(async v => {
                let cats = (t as any).categories
                if (cats && cats.length) {
                    (t as any).categories = []
                    for (let c of cats) {
                        (t as any).categories.push(await Tag.findOne({name: c}))
                    }
                }
                if (!v) {
                    v = new Tag(t)
                } else {
                    v.set(t)
                }
                return v.save()
            })
        }
    }
}