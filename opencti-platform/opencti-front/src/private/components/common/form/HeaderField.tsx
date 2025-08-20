import React, { FunctionComponent, ReactElement } from 'react';
import { Field, FieldArray } from 'formik';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import { AddOutlined, DeleteOutlined } from '@mui/icons-material';
import Paper from '@mui/material/Paper';
import { useFormatter } from '../../../../components/i18n';
import TextField from '../../../../components/TextField';

export const isValidHeaderName = (name: string): boolean => {
  return /^[A-Za-z0-9!#$&\-\^_`|~]+$/.test(name);
};

export const areHeadersValid = (headers: { name: string, value: string }[]): boolean => {
  return headers.every((header) => 
    header.name && 
    header.value && 
    isValidHeaderName(header.name)
  );
};

interface HeaderFieldAddProps {
  id: string;
  name: string;
  values: { name: string, value: string }[];
  containerStyle: { marginTop: number; width: string };
  setFieldValue?: (name: string, value: unknown) => void;
  onChange?: (name: string, value: { name: string, value: string }[]) => void;
}
// eslint-disable-next-line import/prefer-default-export
export const HeaderFieldAdd: FunctionComponent<HeaderFieldAddProps> = ({
  name,
  values,
  containerStyle,
  onChange,
}): ReactElement => {
  const { t_i18n } = useFormatter();
  return (
    <div style={containerStyle}>
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <>
            <div id="total_headers">
              {values?.map((_, index) => (
                <Paper className={'paper-for-grid'} variant="outlined"
                  key={index}
                  style={{ marginTop: 20, padding: 20, width: '100%', position: 'relative' }}
                >
                  <div
                    style={{
                      paddingRight: 50,
                      display: 'grid',
                      gap: 20,
                      gridTemplateColumns: 'repeat(2, 1fr)',
                    }}
                  >
                    <Field
                      component={TextField}
                      variant="standard"
                      name={`${name}.${index}.name`}
                      label={t_i18n('Header name')}
                      onSubmit={onChange ? () => {
                        if (areHeadersValid(values)) {
                          onChange(name, values);
                        }
                      } : undefined}
                    />
                    <Field
                      component={TextField}
                      variant="standard"
                      name={`${name}.${index}.value`}
                      label={t_i18n('Header value')}
                      onSubmit={onChange ? () => {
                        if (areHeadersValid(values)) {
                          onChange(name, values);
                        }
                      } : undefined}
                    />
                  </div>
                  <IconButton
                    id="deleteHeader"
                    aria-label="Delete"
                    onClick={() => {
                      arrayHelpers.remove(index);
                      if (onChange) {
                        const newValues = values.filter((_, i) => i !== index);
                        if (areHeadersValid(newValues)) {
                          onChange(name, newValues);
                        }
                      }
                    }}
                    size="large"
                    style={{ position: 'absolute', right: 0, top: 5 }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </Paper>
              ))}
              <Button
                size="small"
                startIcon={<AddOutlined />}
                variant="contained"
                color="primary"
                aria-label="Add"
                id="addHeader"
                onClick={() => {
                  arrayHelpers.push({ name: '', value: '' });
                  // Don't call onChange for adding empty headers - they're invalid until filled
                }}
                style={{ marginTop: (values?.length ?? 0) > 0 ? 20 : 0 }}
              >
                {t_i18n('Add header')}
              </Button>
            </div>
          </>
        )}
      />
    </div>
  );
};
