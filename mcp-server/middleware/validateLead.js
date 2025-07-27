const validateLead = (req, res, next) => {
    const { data } = req.body;
    const missingFields = [];
    const fieldMessages = [];
    
    if (!data) {
        return res.status(200).json({
            message: "Handled",
            mcpResponse: {
                status: 400,
                error: {
                    message: "Please provide lead information",
                    missingFields: [
                        "Name is required",
                        "Source is required",
                        "Email is required",
                        "At least one interested product is required"
                    ]
                }
            }
        });
    }

    // Check required fields
    if (!data.name) {
        missingFields.push('name');
        fieldMessages.push('Name is missing. Example: John Doe');
    }
    
    if (!data.source) {
        missingFields.push('source');
        fieldMessages.push('Source is missing. Example: website, referral, social media');
    }
    
    if (!data.contact?.email) {
        missingFields.push('email');
        fieldMessages.push('Email is missing. Example: john@example.com');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email)) {
        return res.status(200).json({
            message: "Handled",
            mcpResponse: {
                status: 400,
                error: {
                    message: "Invalid email format",
                    missingFields: ["Please provide a valid email address (example: user@example.com)"]
                }
            }
        });
    }
    
    if (!Array.isArray(data.interestedProducts) || data.interestedProducts.length === 0) {
        missingFields.push('interestedProducts');
        fieldMessages.push('At least one interested product is required. Example: ["premium plan", "basic plan"]');
    }

    if (missingFields.length > 0) {
        // If phone is missing but not required, don't show error for it
        if (data.contact && !data.contact.phone) {
            fieldMessages.push('Phone number is missing (optional)');
        }
        
        return res.status(200).json({
            message: "Handled",
            mcpResponse: {
                status: 400,
                error: {
                    message: "Please provide the following information",
                    missingFields: fieldMessages,
                    example: {
                        name: "John Doe",
                        source: "website",
                        contact: {
                            email: "john@example.com",
                            phone: "1234567890"
                        },
                        interestedProducts: ["premium plan"],
                        status: "New",
                        notes: "Interested in learning more about features"
                    }
                }
            }
        });
    }

    next();
};

module.exports = validateLead;
