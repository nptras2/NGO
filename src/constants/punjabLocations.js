// Punjab, India Districts and Major Cities
export const PUNJAB_LOCATIONS = {
  "Amritsar": ["Amritsar", "Majitha", "Ajnala", "Rayya", "Jandiala Guru", "Ramdass"],
  "Barnala": ["Barnala", "Tapa", "Bhadaur", "Dhanaula"],
  "Bathinda": ["Bathinda", "Bucha", "Mauri", "Raman", "Sangat", "Talwandi Sabo", "Bhucho Mandi", "Goniana"],
  "Faridkot": ["Faridkot", "Kotkapura", "Jaitu"],
  "Fatehgarh Sahib": ["Fatehgarh Sahib", "Sirhind", "Mandi Gobindgarh", "Amloh", "Khamanon"],
  "Fazilka": ["Fazilka", "Abohar", "Jalalabad"],
  "Firozpur": ["Firozpur", "Firozpur Cantt", "Zira", "Guruharsahai"],
  "Gurdaspur": ["Gurdaspur", "Batala", "Dera Baba Nanak", "Dhariwal", "Qadian", "Sri Hargobindpur"],
  "Hoshiarpur": ["Hoshiarpur", "Dasuya", "Mukerian", "Urmar Tanda", "Garhdiwala", "Hariana", "Mahilpur"],
  "Jalandhar": ["Jalandhar", "Kartarpur", "Nakodar", "Phillaur", "Shahkot", "Adampur", "Alawalpur", "Bhogpur", "Goraya"],
  "Kapurthala": ["Kapurthala", "Phagwara", "Sultanpur Lodhi", "Bholath"],
  "Ludhiana": ["Ludhiana", "Khanna", "Jagraon", "Samrala", "Mullanpur Dakha", "Doraha", "Payal", "Raikot", "Sahnewal"],
  "Malerkotla": ["Malerkotla", "Ahmedgarh", "Amargarh"],
  "Mansa": ["Mansa", "Budhlada", "Bareta", "Bhikhi"],
  "Moga": ["Moga", "Baghapurana", "Dharamkot", "Nihal Singh Wala"],
  "Muktsar": ["Sri Muktsar Sahib", "Malout", "Gidderbaha"],
  "Nawanshahr": ["Nawanshahr", "Bangla", "Rahon", "Balachaur"],
  "Pathankot": ["Pathankot", "Sujanpur", "Gharota"],
  "Patiala": ["Patiala", "Rajpura", "Nabha", "Samana", "Patran", "Sanaur"],
  "Rupnagar": ["Rupnagar", "Anandpur Sahib", "Nangal", "Kiratpur Sahib", "Morinda"],
  "Mohali": ["Sahibzada Ajit Singh Nagar (Mohali)", "Kharar", "Zirakpur", "Dera Bassi", "Kurali", "Nayagaon"],
  "Sangrur": ["Sangrur", "Sunam", "Dhuri", "Lehragaga", "Moonak", "Bhawanigarh"],
  "Tarn Taran": ["Tarn Taran Sahib", "Patti", "Bhikhiwind", "Khadoor Sahib"]
};

export const PUNJAB_DISTRICTS = Object.keys(PUNJAB_LOCATIONS).sort();

export const getAllPunjabCities = () => {
  let cities = [];
  Object.values(PUNJAB_LOCATIONS).forEach(cityList => {
    cities = [...cities, ...cityList];
  });
  return cities.sort();
};
