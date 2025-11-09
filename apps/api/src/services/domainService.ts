import Domain from '../database/models/Domain';

export const findAllDomains = async () => {
  return await Domain.find().select('-__v');
};

export const findDomainBySlug = async (slug: string) => {
  const domain = await Domain.findOne({ slug }).select('-__v');
  if (!domain) {
    throw new Error('Domain not found');
  }
  return domain;
};