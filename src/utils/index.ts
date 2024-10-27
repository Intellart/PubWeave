import { forEach, get, isArray, isEqual, isObject, omit, reduce } from "lodash";

// $FlowFixMe
export const isPromise = (p: Promise<any>): boolean =>
  !!p && typeof p.then === "function";

export const jsonToFormData = (rootParam: string, payload: any): FormData => {
  const formData = new FormData();

  const buildFormData = (data: any[], parentKey?: string) => {
    const isValidObject =
      !(data instanceof Date) &&
      !(data instanceof File) &&
      !(data instanceof Blob);

    if (data && isObject(data) && isValidObject) {
      forEach(data, (val: any, key: number) => {
        const propertyPath = isArray(data) ? "[]" : `[${key}]`;

        buildFormData(
          data[key],
          parentKey ? parentKey + propertyPath : String(key)
        );
      });

      return;
    }

    if (parentKey) formData.append(parentKey, data as any);
  };

  buildFormData({ [rootParam]: payload } as any);

  return formData;
};

export const isFileType = (value: any): boolean =>
  value instanceof File || value instanceof Blob;

export const getObjectDifferences = (root: any, ref: any): any => {
  const diffKeys: string[] = reduce(
    root,
    (result: string[], value, key) => {
      if (isEqual(value, get(ref, key))) {
        result = [...result, key];
      }

      return result;
    },
    []
  );

  return omit(root, diffKeys);
};
