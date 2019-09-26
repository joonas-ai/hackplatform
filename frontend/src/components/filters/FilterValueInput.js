import React from 'react';
import { FilterTypes, FilterValues } from '@hackjunction/shared';

import TextInput from 'components/inputs/TextInput';
import Select from 'components/inputs/Select';

const FilterValueInput = ({ filterType, valueType, value, onChange, event }) => {
    const inputParams = { value, onChange };
    switch (filterType) {
        case FilterTypes.filterTypes.LESS_THAN.id:
        case FilterTypes.filterTypes.NOT_LESS_THAN.id:
        case FilterTypes.filterTypes.MORE_THAN.id:
        case FilterTypes.filterTypes.NOT_MORE_THAN.id:
            return (
                <TextInput
                    label="Enter a number here"
                    helperText="If the field is a text field or a list of values, compares the length of the value"
                    {...inputParams}
                />
            );
        case FilterTypes.filterTypes.CONTAINS.id:
        case FilterTypes.filterTypes.NOT_CONTAINS.id:
        case FilterTypes.filterTypes.EQUALS.id:
        case FilterTypes.filterTypes.NOT_EQUALS.id:
            switch (valueType) {
                case FilterValues.STRING:
                    return <TextInput label="Enter value" {...inputParams} />;
                case FilterValues.BOOLEAN:
                    return <TextInput label="Boolean field" {...inputParams} />;
                case FilterValues.DATE:
                    return <TextInput label="Date field" {...inputParams} />;
                case FilterValues.GENDER:
                    return <Select label="Gender select" type="gender" {...inputParams} />;
                case FilterValues.NATIONALITY:
                    return <Select label="Nationality" type="nationality" {...inputParams} />;
                case FilterValues.LANGUAGE:
                    return <Select label="Language" type="language" {...inputParams} />;
                case FilterValues.TAG:
                    const options = event.tags.map(tag => ({
                        value: tag.label,
                        label: tag.label
                    }));
                    return <Select label="Select tag" options={options} {...inputParams} />;
                case FilterValues.STATUS:
                    return <Select label="Select status" type="status" {...inputParams} />;
                default:
                    return null;
            }
        case FilterTypes.filterTypes.IS_EMPTY:
        case FilterTypes.filterTypes.NOT_EMPTY:
        case FilterTypes.filterTypes.BOOLEAN_FALSE.id:
        case FilterTypes.filterTypes.BOOLEAN_TRUE.id:
            return null;
        default:
            return null;
    }
};

export default FilterValueInput;
