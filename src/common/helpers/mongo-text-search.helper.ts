import * as _ from 'lodash';

export const mongoTextSearch = (args) => {
  const { field, project, index, query, limit } = args;

  const aggregationStages = [
    {
      $search: {
        index,
        autocomplete: {
          query,
          path: field,
          fuzzy: { maxEdits: 1, prefixLength: 2 },
          score: { boost: { value: 1 } },
        },
      },
    },
    { $match: { isDeleted: false } },
    { $limit: 10 },
    { $project: { name: 1, _id: 1 } },
  ];

  if (!_.isNil(limit)) {
    aggregationStages.push({ $limit: limit });
  }

  if (!_.isNil(project)) {
    aggregationStages.push({ $project: project });
  }

  return aggregationStages;
};
