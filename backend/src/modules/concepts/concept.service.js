'use strict';
const conceptModel = require('./concept.model');
const ApiError = require('../../utils/ApiError');

const getAll = () => conceptModel.findAll();

const getBySlug = async (slug) => {
  const concept = await conceptModel.findBySlug(slug);
  if (!concept) throw ApiError.notFound(`Concept "${slug}" not found`);
  return concept;
};

module.exports = { getAll, getBySlug };
