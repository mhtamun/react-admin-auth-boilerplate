import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import _ from 'lodash';
import { Button } from 'primereact/button';
import { InputField } from '../index';
import { callPostApi, callPutApi } from '../../libs/api';
import { showErrorToast } from '../../utils/toast';
import { getFormData } from '../../utils';

export default function GenericFormGenerator({
    datum = null,
    fields,
    nonEdibleFields = [],
    // method = null,
    // uri = null,
    callback,
    onValueModify,
    // onShowSubmitButton = null,
    submitButtonText = null,
    resetButtonText = null,
    enableReinitialize = false,
}: {
    datum?: any;
    fields: any[];
    nonEdibleFields?: string[];
    callback: (value: any, callback: () => void) => void;
    onValueModify?: (value: any) => void;
    submitButtonText?: string;
    resetButtonText?: string;
    enableReinitialize?: boolean;
}) {
    // console.debug({ datum });

    console.debug({ fields });

    const formik = useFormik({
        enableReinitialize,

        initialValues: !datum
            ? _.reduce(
                  fields,
                  (result, field, index) => {
                      const temp: any = result;
                      temp[field.name] =
                          field.initialValue === null || field.initialValue === undefined ? null : field.initialValue;

                      return temp;
                  },
                  {}
              )
            : _.pick(
                  datum,
                  _.map(fields, (field) => field.name)
              ),

        validate: (values) => {
            return _.reduce(
                fields,
                (errors, field) => {
                    const result =
                        _.isUndefined(field.validate) || _.isNull(field.validate) ? null : field.validate(values);

                    if (!_.isNull(result))
                        return {
                            ...errors,
                            [field.name]: result,
                        };

                    return { ...errors };
                },
                {}
            );
        },

        onSubmit: (values, { setSubmitting }) => {
            // console.debug({ values });

            setSubmitting(true);

            const hiddenFields: any[] = [];

            // todo: Implement not showing fields to remove from values
            // Check false value not to submit in the form
            _.mapKeys(values, (value, key) => {
                if (_.isUndefined(value) || _.isNull(value)) hiddenFields.push(key);
            });

            // Check information type value or not showing value not to submit in the form
            const tempFalseFields = _.filter(fields, (field) => field.type === 'information' || field.show === false);
            _.map(tempFalseFields, (field) => {
                hiddenFields.push(field.name);
            });

            // console.debug({ hiddenFields });

            const filteredValues = _.omit(values, [...hiddenFields, ...nonEdibleFields]);
            // console.debug({ filteredValues });

            // if (!_.isUndefined(method) && !_.isNull(method) && !_.isUndefined(uri) && !_.isNull(uri)) {
            //     let response = null;
            //     let payload = null;

            //     if (_.some(fields, (field) => field.type === 'file')) {
            //         payload = getFormData(filteredValues);
            //     } else {
            //         payload = filteredValues;
            //     }

            //     if (method.toLowerCase() === 'post') response = await callPostApi(uri, payload);
            //     else if (method.toLowerCase() === 'put') response = await callPutApi(uri, payload);

            //     if (!response) {
            //         showErrorToast('Server not found!');
            //         return;
            //     }

            //     if (response.statusCode !== 200) {
            //         showErrorToast(response.message);
            //         return;
            //     }

            callback(filteredValues, () => {
                setSubmitting(false);
                formik.resetForm();
            });

            // } else {
            //     callback(filteredValues);
            // }
        },
    });

    // function onKeyDown(keyEvent) {
    //     if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
    //         keyEvent.preventDefault();
    //     }
    // }

    function getField(field: any) {
        console.debug({
            field,
        });

        const errorMessage: string = !formik.touched[field.name]
            ? ''
            : !formik.errors[field.name]
            ? ''
            : formik.errors[field.name];

        // if (field.type === 'information')
        //     return (
        //         <Input
        //             id={field.name}
        //             type={'text'}
        //             name={field.name}
        //             placeholder={field.placeholder}
        //             title={field.title}
        //             value={
        //                 !_.isUndefined(formik.values[field.name]) && !_.isNull(formik.values[field.name])
        //                     ? formik.values[field.name]
        //                     : !_.isUndefined(field.value) && !_.isNull(field.value)
        //                     ? field.value
        //                     : ''
        //             }
        //             isDisabled={true}
        //         />
        //     );

        if (
            field.type === 'date' ||
            field.type === 'email' ||
            field.type === 'hidden' ||
            field.type === 'number' ||
            field.type === 'password' ||
            field.type === 'tel' ||
            field.type === 'text'
        )
            return (
                <InputField
                    name={field.name}
                    type={field.type}
                    title={field.title}
                    placeholder={field.placeholder}
                    value={formik.values[field.name] ?? ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={field.isDisabled}
                    errorMessage={errorMessage}
                />
            );

        // if (field.type === 'file')
        //     return (
        //         <FileInput
        //             key={field.name}
        //             name={field.name}
        //             placeholder={field.placeholder}
        //             title={field.title}
        //             formValues={formik.values}
        //             setFieldValue={formik.setFieldValue}
        //             setFieldTouched={formik.setFieldTouched}
        //             errorMessage={errorMessage}
        //         />
        //     );

        //   if (field.type === 'radio-group') {
        //       return (
        //           <RadioGroup
        //               key={field.name}
        //               id={field.name}
        //               name={field.name}
        //               label={field.label}
        //               message={!formik.touched[field.name] ? '' : formik.errors[field.name]}
        //               value={formik.values[field.name]}
        //               options={field.options}
        //               setFieldValue={(name, value) => {
        //                   formik.setFieldValue(name, value);
        //                   field.setFieldValue && field.setFieldValue(name, value);
        //               }}
        //           />
        //       );
        //   }

        // if (field.type === 'checkbox-group') {
        //     return (
        //         <CheckboxGroup
        //             key={field.name}
        //             name={field.name}
        //             title={field.title}
        //             selectedValues={formik.values[field.name]}
        //             options={field.options}
        //             onSelect={(fieldName, option) => {
        //                 // console.debug({ fieldName, option });

        //                 const tempSelectedOptions = !formik.values[fieldName] ? [] : formik.values[fieldName];
        //                 tempSelectedOptions.push(option.value);

        //                 formik.setFieldValue(fieldName, tempSelectedOptions);
        //             }}
        //             onDeselect={(fieldName, option) => {
        //                 // console.debug({ fieldName, option });

        //                 const tempSelectedOptions = formik.values[fieldName].filter(
        //                     (selectedOption) => selectedOption !== option.value
        //                 );

        //                 formik.setFieldValue(fieldName, tempSelectedOptions);
        //             }}
        //             isDisabled={field.isDisabled}
        //             errorMessage={errorMessage}
        //         />
        //     );
        // }

        // if (field.type === 'select-sync')
        //     return (
        //         <SelectSync
        //             key={field.name}
        //             name={field.name}
        //             placeholder={field.placeholder}
        //             title={field.title}
        //             value={formik.values[field.name]}
        //             options={field.options}
        //             setFieldValue={(name, value, label) => {
        //                 console.debug({ name, value });

        //                 formik.setFieldValue(name, value);

        //                 if (field.onSelect) field.onSelect(value, label, formik.setFieldValue);
        //             }}
        //             setFieldTouched={formik.setFieldTouched}
        //             isSearchable={field.isSearchable}
        //             isDisabled={field.isDisabled}
        //             errorMessage={errorMessage}
        //         />
        //     );

        // if (field.type === 'select-async')
        //     return (
        //         <SelectAsync
        //             key={field.name}
        //             name={field.name}
        //             placeholder={field.placeholder}
        //             title={field.title}
        //             value={formik.values[field.name]}
        //             defaultOptions={field.options}
        //             loadOptions={field.loadOptions}
        //             setFieldValue={(name, value, label) => {
        //                 // console.debug({ name, value });

        //                 formik.setFieldValue(name, value);

        //                 if (field.onSelect) field.onSelect(value, label, formik.setFieldValue);
        //             }}
        //             setFieldTouched={formik.setFieldTouched}
        //             isMulti={field.isMulti}
        //             isSearchable={field.isSearchable}
        //             isClearable={field.isClearable}
        //             isDisabled={field.isDisabled}
        //             errorMessage={errorMessage}
        //         />
        //     );

        // if (field.type === 'custom')
        //     return (
        //         <field.component
        //             key={field.name}
        //             name={field.name}
        //             placeholder={field.placeholder}
        //             title={field.title}
        //             value={formik.values[field.name]}
        //             defaultOptions={field.options}
        //             loadOptions={field.loadOptions}
        //             formValues={formik.values}
        //             setFieldValue={(name, value) => {
        //                 // console.debug({ name, value });

        //                 formik.setFieldValue(name, value);

        //                 if (field.onSelect) field.onSelect(value);
        //             }}
        //             setFieldError={formik.setFieldError}
        //             setFieldTouched={formik.setFieldTouched}
        //             isDisabled={field.isDisabled}
        //             isClearable={field.isClearable}
        //             errorMessage={errorMessage}
        //         />
        //     );
    }

    // let count = 0;
    const formFields = [...fields];
    // while (count < _.size(fields)) {
    //     if (
    //         !_.isUndefined(fields[count].show) &&
    //         !_.isNull(fields[count].show) &&
    //         fields[count].show(formik.values) === false
    //     ) {
    //         count++;

    //         continue;
    //     }

    //     const numberOfColumn = fields[count].col;

    //     if (!_.isUndefined(numberOfColumn) && !_.isNull(numberOfColumn) && numberOfColumn > 1) {
    //         const insideItems = [];

    //         /* Hidden field count check */
    //         let numberOfHiddenColumns = 0;
    //         let tempCount = count;
    //         for (let i = 0; i < numberOfColumn; i++) {
    //             if (fields[tempCount].type === 'hidden') numberOfHiddenColumns++;

    //             tempCount++;
    //         }
    //         /* Hidden field count check */

    //         for (let i = 0; i < numberOfColumn; i++) {
    //             insideItems.push(
    //                 <div
    //                     key={'inside' + i + 'column'}
    //                     className={`form-group col-md-${Math.ceil(12 / (numberOfColumn - numberOfHiddenColumns))}`}
    //                     style={fields[count].type === 'hidden' ? { display: 'none' } : {}}
    //                 >
    //                     {getField(fields[count])}
    //                 </div>
    //             );

    //             count++;
    //         }

    //         formFields.push(
    //             <div key={count + 1} className="form-row">
    //                 {_.map(insideItems, (insideItem) => insideItem)}
    //             </div>
    //         );
    //     } else {
    //         formFields.push(
    //             <div
    //                 key={count + 1}
    //                 className="form-row"
    //                 style={fields[count].type === 'hidden' ? { display: 'none' } : {}}
    //             >
    //                 <div className="form-group col-md-12">{getField(fields[count])}</div>
    //             </div>
    //         );

    //         count++;
    //     }
    // }

    let submitButton = <Button label="Submit"></Button>;

    // if (_.isUndefined(onShowSubmitButton) || _.isNull(onShowSubmitButton))
    //     submitButton = (
    //         <CButton type="submit" className="mt-1" color="primary">
    //             {!submitButtonText ? 'Submit' : submitButtonText}
    //         </CButton>
    //     );
    // else {
    //     if (onShowSubmitButton(formik.values))
    //         submitButton = (
    //             <CButton type="submit" className="mt-1" color="primary" size="sm">
    //                 {!submitButtonText ? 'Submit' : submitButtonText}
    //             </CButton>
    //         );
    // }

    // Handle data change instantly
    // useEffect(() => {
    //     if (onValueModify !== null && typeof onValueModify === 'function') onValueModify(formik.values);
    // }, [formik.values]);

    return (
        <form onSubmit={formik.handleSubmit}>
            {formFields.map((formField) => {
                console.debug({ formField });

                return getField(formField);
            })}
            {submitButton}
            {/* {!resetButtonText ? null : (
                <CButton
                    className="mt-1 ml-3"
                    variant="outline"
                    color="primary"
                    onClick={(e) => {
                        e.preventDefault();

                        for (const name in formik.values) {
                            formik.setFieldValue(name, null);
                        }

                        // formik.resetForm();

                        callback(formik.values);
                    }}
                >
                    {resetButtonText}
                </CButton>
            )} */}
        </form>
    );
}
