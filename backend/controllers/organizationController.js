import Organization from '../models/Organization.js';

export const createOrganization = async (req, res) => {
  try {
    const organization = new Organization(req.body);
    const savedOrganization = await organization.save();
    res.status(201).json(savedOrganization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrganizations = async (req, res) => {
  try {
    const { type, verified } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (verified !== undefined) filter.verified = verified === 'true';
    
    const organizations = await Organization.find(filter).sort({ createdAt: -1 });
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json(organization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json(organization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndDelete(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json({ message: 'Organization deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};