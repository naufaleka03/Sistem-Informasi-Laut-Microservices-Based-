const fs = require("fs");
const path = require("path");

const fishSpeciesFilePath = path.resolve(__dirname, "../models/fishSpeciesData.json");

// Read data from JSON file
const fishSpeciesData = JSON.parse(fs.readFileSync(fishSpeciesFilePath));

// Controller function to get all fish species
const getAll = (req, res) => {
    try {
        // Return all fish species
        return res.status(200).json(fishSpeciesData);
    } catch (error) {
        // Handle errors
        console.error("Error getting all fish species:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller function to get a fish species by ID
const getById = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        // Find the fish species with the specified ID
        const fishSpecies = fishSpeciesData.find(fish => fish.id === id);
        if (!fishSpecies) {
            return res.status(404).json({ error: 'Fish Species not found' })
        }
        // Return the found fish species
        return res.status(200).json(fishSpecies);
    } catch (error) {
        // Handle errors
        console.error("Error getting fish species by ID:", error);
        return res.status(500).json({ error: "Internal server error" });
    } 
};

// Controller function to create a new fish species
const create = (req, res) => {
    try {
        const { name, description, length_m, weight_kg } = req.body;
        // Check if name and description are provided
        if (!name || !description || !length_m || !weight_kg) {
            return res.status(400).json({ error: 'Entry are required' });
        }
        // Get the next available ID by incrementing the last ID in the data storage
        const lastId = fishSpeciesData.length > 0 ? fishSpeciesData[fishSpeciesData.length - 1].id : 0;
        const id = lastId + 1;
        // Create the new fish species object
        const newFishSpecies = { id, name, description, length_m, weight_kg };
        // Add the new fish species to the data storage
        fishSpeciesData.push(newFishSpecies);
        // Return the newly created fish species
        return res.status(201).json(newFishSpecies);
    } catch (error) {
        // Handle errors
        console.error('Error creating fish species:', error);
        return res.status(500).json({ error: "Internal server error" })
    }
};

// Controller function to update an existing fish species
const update = (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, length_m, weight_kg } = req.body;
        // Find the index of the fish species with the specified ID
        const index = fishSpeciesData.findIndex(fish => fish.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Fish species not found" })
        }
        // Update the fish species with the new data
        fishSpeciesData[index] = { ...fishSpeciesData[index], name, description, length_m, weight_kg };
        // Return the updated fish species
        return res.status(200).json(fishSpeciesData[index]);
    } catch (error) {
        // Handle errors
        console.error("Error updating fish species:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Controller function to delete a fish species
const remove = (req, res) => {
    try {
        const { id } = req.params;
        // Filter out the fish species with the specified ID
        fishSpeciesData = fishSpeciesData.filter(fish => fish.id !== id);
        // Return success message
        return res.status(200).json({ message: "Fish species deleted successfully" })
    } catch (error) {
        // Handle errors
        console.error("Error deleting fish species:", error);
        return res.status(500).json({ error: "Internal Server error" })
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
}