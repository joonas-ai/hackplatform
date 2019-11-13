const yup = require('yup');

/** The user editable fields and their validation rules for a Project */
//TODO: Add tracks and challenges
const ProjectSchema = {
    name: yup
        .string()
        .required()
        .max(100)
        .label('Project name'),
    punchline: yup
        .string()
        .required()
        .max(300)
        .label('Punchline'),
    description: yup
        .string()
        .required()
        .max(3000)
        .label('Description'),
    source: yup
        .string()
        .url()
        .required()
        .label('Source code'),
    sourcePublic: yup
        .boolean()
        .default(true)
        .label('Source code public'),
    demo: yup
        .string()
        .url()
        .label('Demo link'),
    images: yup
        .array()
        .of(
            yup.object().shape({
                publicId: yup.string(),
                url: yup.string().url()
            })
        )
        .max(4)
        .ensure()
        .label('Images'),
    location: yup.string().label('Table location')
};

const buildProjectSchema = event => {
    const schema = { ...ProjectSchema };

    if (event.tracksEnabled) {
        schema.track = yup
            .string()
            .oneOf(event.tracks.map(track => track.slug))
            .required()
            .label('Track');
    }

    if (event.challengesEnabled) {
        schema.challenges = yup
            .array()
            .of(yup.string().oneOf(event.challenges.map(challenge => challenge.slug)))
            .max(5)
            .ensure()
            .label('Challenges');
    }

    return schema;
};

module.exports = buildProjectSchema;
