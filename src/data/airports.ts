export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

export const airports: Airport[] = [
  // India
  { code: "DEL", city: "Delhi", name: "Indira Gandhi International Airport", country: "India" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International Airport", country: "India" },
  { code: "BLR", city: "Bangalore", name: "Kempegowda International Airport", country: "India" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International Airport", country: "India" },
  { code: "MAA", city: "Chennai", name: "Chennai International Airport", country: "India" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose International Airport", country: "India" },
  { code: "JAI", city: "Jaipur", name: "Jaipur International Airport", country: "India" },
  { code: "AMD", city: "Ahmedabad", name: "Sardar Vallabhbhai Patel International Airport", country: "India" },
  { code: "COK", city: "Kochi", name: "Cochin International Airport", country: "India" },
  { code: "GOI", city: "Goa (Dabolim)", name: "Dabolim Airport", country: "India" },
  { code: "GOX", city: "Goa (Mopa)", name: "Manohar International Airport", country: "India" },
  { code: "PNQ", city: "Pune", name: "Pune Airport", country: "India" },
  { code: "LKO", city: "Lucknow", name: "Chaudhary Charan Singh International Airport", country: "India" },
  { code: "GAU", city: "Guwahati", name: "Lokpriya Gopinath Bordoloi International Airport", country: "India" },
  { code: "TRV", city: "Thiruvananthapuram", name: "Trivandrum International Airport", country: "India" },
  { code: "PAT", city: "Patna", name: "Jay Prakash Narayan Airport", country: "India" },
  { code: "SXR", city: "Srinagar", name: "Sheikh ul-Alam International Airport", country: "India" },
  { code: "BBI", city: "Bhubaneswar", name: "Biju Patnaik Airport", country: "India" },
  { code: "IXC", city: "Chandigarh", name: "Chandigarh Airport", country: "India" },
  { code: "IXB", city: "Bagdogra", name: "Bagdogra Airport", country: "India" },
  { code: "VNS", city: "Varanasi", name: "Lal Bahadur Shastri Airport", country: "India" },
  { code: "IDR", city: "Indore", name: "Devi Ahilya Bai Holkar Airport", country: "India" },
  { code: "NGP", city: "Nagpur", name: "Dr. Babasaheb Ambedkar International Airport", country: "India" },
  { code: "ATQ", city: "Amritsar", name: "Sri Guru Ram Dass Jee International Airport", country: "India" },
  { code: "VTZ", city: "Visakhapatnam", name: "Visakhapatnam Airport", country: "India" },

  // International
  { code: "DXB", city: "Dubai", name: "Dubai International Airport", country: "UAE" },
  { code: "LHR", city: "London", name: "Heathrow Airport", country: "UK" },
  { code: "SIN", city: "Singapore", name: "Changi Airport", country: "Singapore" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport", country: "Thailand" },
  { code: "DMK", city: "Bangkok", name: "Don Mueang International Airport", country: "Thailand" },
  { code: "KUL", city: "Kuala Lumpur", name: "Kuala Lumpur International Airport", country: "Malaysia" },
  { code: "JFK", city: "New York", name: "John F. Kennedy International Airport", country: "USA" },
  { code: "SFO", city: "San Francisco", name: "San Francisco International Airport", country: "USA" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle Airport", country: "France" },
  { code: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany" },
  { code: "AMS", city: "Amsterdam", name: "Schiphol Airport", country: "Netherlands" },
  { code: "IST", city: "Istanbul", name: "Istanbul Airport", country: "Turkey" },
  { code: "HND", city: "Tokyo", name: "Haneda Airport", country: "Japan" },
  { code: "NRT", city: "Tokyo", name: "Narita International Airport", country: "Japan" },
  { code: "HKG", city: "Hong Kong", name: "Hong Kong International Airport", country: "Hong Kong" }
];

