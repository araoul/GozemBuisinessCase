# GozemBuisinessCase

# *****************Gozem test project in Type Script************************

# 0- Start the project : `npm install` and `npm run dev || npm run start`
# 1- Make a post request to "api/get_distance_and_time" 
# 2- Example of Request body object : 
{
 start: { lat: 33.58831, lng: -7.61138 },
 end: { lat: 35.6895, lng: 139.69171 },
 units: "metric"
 }
# 3- Example of Response object: 
{
start: {
country: "Morocco",
timezone: "GMT+1",
location: { lat: 33.58831, lng: -7.61138 }
},
end: {
country: "Japan",
timezone: "GMT+9",
location: { lat: 35.6895, lng: 139.69171 }
},
distance: {
value: 11593,
units: "km"
},
time_diff: {
value: 8,
units: "hours"
}
}
