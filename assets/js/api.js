// API Functions for Steam Dreams America

// Mock data for ports and representatives
const mockPorts = [
    {
        id: 'port-1',
        name: 'Port of Los Angeles',
        description: 'America\'s premier port with extensive STEAM education opportunities and maritime technology programs.',
        distance: 15,
        location: { lat: 33.7278, lng: -118.2601 }
    },
    {
        id: 'port-2',
        name: 'Port of Long Beach',
        description: 'Innovative port community with robotics and automation training programs for the next generation.',
        distance: 18,
        location: { lat: 33.7701, lng: -118.1937 }
    },
    {
        id: 'port-3',
        name: 'Port of New York and New Jersey',
        description: 'Historic port with modern STEAM education initiatives and community development programs.',
        distance: 25,
        location: { lat: 40.7128, lng: -74.0060 }
    },
    {
        id: 'port-4',
        name: 'Port of Savannah',
        description: 'Growing port community with emerging technology programs and workforce development initiatives.',
        distance: 30,
        location: { lat: 32.0809, lng: -81.0912 }
    },
    {
        id: 'port-5',
        name: 'Port of Seattle',
        description: 'Pacific Northwest port with environmental science and sustainable technology education programs.',
        distance: 22,
        location: { lat: 47.6062, lng: -122.3321 }
    },
    {
        id: 'port-6',
        name: 'Port of Houston',
        description: 'Energy-focused port with engineering and technology education programs for the energy sector.',
        distance: 28,
        location: { lat: 29.7604, lng: -95.3698 }
    },
    {
        id: 'port-7',
        name: 'Port of Miami',
        description: 'International gateway with logistics and supply chain management education programs.',
        distance: 20,
        location: { lat: 25.7617, lng: -80.1918 }
    },
    {
        id: 'port-8',
        name: 'Port of Charleston',
        description: 'Historic port with modern maritime technology and engineering education initiatives.',
        distance: 35,
        location: { lat: 32.7765, lng: -79.9311 }
    }
];

const mockRepresentatives = [
    {
        id: 'rep-1',
        name: 'Senator John Smith',
        office: 'U.S. Senate',
        party: 'Democrat',
        state: 'CA',
        email: 'senator.smith@senate.gov',
        phone: '(202) 224-3841'
    },
    {
        id: 'rep-2',
        name: 'Representative Sarah Johnson',
        office: 'U.S. House of Representatives',
        party: 'Republican',
        state: 'CA',
        email: 'sarah.johnson@house.gov',
        phone: '(202) 225-1956'
    },
    {
        id: 'rep-3',
        name: 'Senator Michael Brown',
        office: 'U.S. Senate',
        party: 'Independent',
        state: 'NY',
        email: 'senator.brown@senate.gov',
        phone: '(202) 224-6542'
    },
    {
        id: 'rep-4',
        name: 'Representative Lisa Davis',
        office: 'U.S. House of Representatives',
        party: 'Democrat',
        state: 'NY',
        email: 'lisa.davis@house.gov',
        phone: '(202) 225-7944'
    }
];

// Port API functions
function getPortsByLocation(location) {
    // Simulate API call with location-based filtering
    const locationLower = location.toLowerCase();
    
    // Filter ports based on location keywords
    const filteredPorts = mockPorts.filter(port => {
        const portName = port.name.toLowerCase();
        const portDesc = port.description.toLowerCase();
        
        return portName.includes(locationLower) || 
               portDesc.includes(locationLower) ||
               locationLower.includes('port') ||
               locationLower.includes('harbor') ||
               locationLower.includes('dock');
    });
    
    // If no exact matches, return nearby ports
    if (filteredPorts.length === 0) {
        return mockPorts.slice(0, 3); // Return first 3 ports as "nearby"
    }
    
    return filteredPorts;
}

function getPortsByCoordinates(lat, lng) {
    // Simulate API call with coordinate-based filtering
    // In a real implementation, this would calculate actual distances
    
    // For demo purposes, return ports with simulated distances
    return mockPorts.map(port => ({
        ...port,
        distance: Math.floor(Math.random() * 50) + 5 // Random distance 5-55 miles
    })).sort((a, b) => a.distance - b.distance).slice(0, 5);
}

function getAllPorts() {
    return mockPorts;
}

// Representative API functions
function getRepresentativesByAddress(address) {
    // Simulate API call with address-based filtering
    const addressLower = address.toLowerCase();
    
    // Filter representatives based on address keywords
    const filteredReps = mockRepresentatives.filter(rep => {
        const repState = rep.state.toLowerCase();
        const repName = rep.name.toLowerCase();
        
        return addressLower.includes(repState) || 
               addressLower.includes('california') ||
               addressLower.includes('new york') ||
               addressLower.includes('ca') ||
               addressLower.includes('ny');
    });
    
    // If no exact matches, return all representatives
    if (filteredReps.length === 0) {
        return mockRepresentatives;
    }
    
    return filteredReps;
}

function getRepresentativesByCoordinates(lat, lng) {
    // Simulate API call with coordinate-based filtering
    // In a real implementation, this would use the Google Civic Information API
    
    // For demo purposes, return representatives based on general location
    if (lat > 40) { // Northern states
        return mockRepresentatives.filter(rep => rep.state === 'NY');
    } else { // Southern states
        return mockRepresentatives.filter(rep => rep.state === 'CA');
    }
}

// Utility functions
function calculateDistance(location1, location2) {
    // Simple distance calculation using Haversine formula
    const R = 3959; // Earth's radius in miles
    const dLat = (location2.lat - location1.lat) * Math.PI / 180;
    const dLng = (location2.lng - location1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(location1.lat * Math.PI / 180) * Math.cos(location2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
}

function extractStateFromAddress(address) {
    // Simple state extraction - in production, use a proper geocoding service
    const stateMatch = address.match(/\b([A-Z]{2})\b/);
    return stateMatch ? stateMatch[1] : 'Unknown';
}

// Export functions for use in other modules
window.getPortsByLocation = getPortsByLocation;
window.getPortsByCoordinates = getPortsByCoordinates;
window.getAllPorts = getAllPorts;
window.getRepresentativesByAddress = getRepresentativesByAddress;
window.getRepresentativesByCoordinates = getRepresentativesByCoordinates;
