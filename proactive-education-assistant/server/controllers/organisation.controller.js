import Organisation from "../models/Organisation.js";

export const getOrganisations = async (_req, res) => {
  try {
    const organisations = await Organisation.find().select("name type");
    return res.json({ organisations });
  } catch (error) {
    console.error("Get organisations error", error);
    return res.status(500).json({ message: "Failed to fetch organisations" });
  }
};
