export type GraphQLExtensions = {
  missingPermission?: string;
};

export type InvalidInputArgs = {
  [key: string]: {
    [key: string]: string;
  };
};
