var express = require('express');
var router = express.Router();
var models = require('../models/index');
var moment = require('moment');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//get all locations
router.get('/api/location', function(req, res) {
  models.Location.findAll({attributes: ['id', 'name', 'selected']}).then(function(location) {
    res.json(location);
  });
});

//get all purposes
router.get('/api/purpose', function(req, res) {
  models.Purpose.findAll({attributes: ['id', 'name']}).then(function(purpose) {
    res.json(purpose);
  });
});

//get all facilities
router.get('/api/facility', function(req, res) {
	models.Facility.findAll({attributes: ['id', 'name', 'selected']}).then(function(facility) {
		res.json(facility);
  });
});

//add new entry of booked room
router.post('/api/book-room', function(req, res) {
	var start_time = moment(req.body.timeHours + ':' + req.body.timeMinutes + ' ' + req.body.timeCycle, ["h:mm A"]);
	var formatted_start_time = start_time.format("h:mm A");
	var end_time = start_time.add({hours: req.body.durationHours, minutes: req.body.durationMinutes});
	var formatted_end_time = end_time.format("h:mm A");

	req.body.room_id.forEach(function(room_id) {
		models.Occupied.create({
			room_id: room_id,
			date: req.body.dateValue,
			start_time: formatted_start_time,
			durationHours: req.body.durationHours,
			durationMinutes: req.body.durationMinutes,
			end_time: formatted_end_time,
			meetingSubject: req.body.meetingSubject,
			timeHours: req.body.timeHours,
			timeMinutes: req.body.timeMinutes,
			timeCycle: req.body.timeCycle
		}).then(function(todo) {
			res.end();
		});
	});
});

//get all matching rooms excluding those occupied

router.get('/api/search', function(req, res) {

	var location = req.body.locations;	
	var facility = req.body.facilities.length == 0 ? [1,2,3,4,5] : req.body.facilities;
	var start_time = moment(req.body.timeHours + ':' + req.body.timeMinutes + ' ' + req.body.timeCycle, ["h:mm A"]);
	var requested_start_time = start_time.format('HH:mm:ss');
	var end_time = start_time.add({hours: req.body.durationHours, minutes: req.body.durationMinutes});
	var requested_end_time = end_time.format('HH:mm:ss');
	
	var query = 'SELECT DISTINCT "R"."id", "R"."name", "R"."details", "L"."name", "R"."max_capacity"' +
				'FROM "Occupieds" AS "O", "Locations" AS "L" INNER JOIN "Rooms" AS "R" ON "R"."location_id" = "L"."id"' +
				'INNER JOIN "Room_Facilities" AS "RF" ON "RF"."room_id" = "R"."id"' +
				'INNER JOIN "Facilities" AS "F" ON  "RF"."facility_id" = "F"."id"' +
				'INNER JOIN "Room_Purposes" AS "RP" ON "RP"."room_id" = "R"."id"' +
				'INNER JOIN  "Purposes" AS "P"  ON  "P"."id" = "RP"."purpose_id" ' +
				'WHERE "L"."id" IN (' + location.toString() + ') AND "R"."min_capacity" <= ? ' +
				'AND "R"."max_capacity" >= ? AND "F"."id" IN (' +  facility.toString() + ') AND "P"."id"= ? and "R"."id" NOT IN(' +
				'SELECT "O"."room_id" FROM "Occupieds" AS "O" WHERE "O"."date" = ? AND ' + "('" + requested_start_time + "'" + ' BETWEEN "O"."start_time" AND "O"."end_time"' +
				' OR ' + "('" + requested_start_time + "'" + ' <= "O"."start_time" AND ' + " '" + requested_end_time + "'" + ' > "O"."start_time")))';
	
	models.sequelize.query(query, {replacements:[req.body.capacity, req.body.capacity, req.body.purpose, req.body.dateValue]})
	  .then(function(result) {
		  res.json(result[0]);
	  });
});

//get all matching rooms including those occupied

router.get('/api/show-occupancy', function(req, res) {

	var location = req.body.locations;
	var facility = req.body.facilities.length == 0 ? [1,2,3,4,5] : req.body.facilities;
	var start_time = moment(req.body.timeHours + ':' + req.body.timeMinutes + ' ' + req.body.timeCycle, ["h:mm A"]);
	var requested_start_time = start_time.format('HH:mm:ss');
	var end_time = start_time.add({hours: req.body.durationHours, minutes: req.body.durationMinutes});
	var requested_end_time = end_time.format('HH:mm:ss');

	var query = 'SELECT DISTINCT "R"."id", "R"."name", "R"."details", "L"."name", "R"."max_capacity", "O"."start_time", "O".end_time, ' +
				'CASE WHEN "O"."date" IS NULL THEN false ELSE true END AS "isOccupied" ' +
				'FROM "Locations" AS "L" INNER JOIN "Rooms" AS "R" ON "R"."location_id" = "L"."id"' +
				'INNER JOIN "Room_Facilities" AS "RF" ON "RF"."room_id" = "R"."id"' +
				'INNER JOIN "Facilities" AS "F" ON  "RF"."facility_id" = "F"."id"' +
				'INNER JOIN "Room_Purposes" AS "RP" ON "RP"."room_id" = "R"."id"' +
				'INNER JOIN  "Purposes" AS "P"  ON  "P"."id" = "RP"."purpose_id" ' +
				'FULL OUTER JOIN "Occupieds" AS "O" ON "O"."room_id" = "R"."id" AND "O"."date" = ? AND ' +
				"('" + requested_start_time + "'" + 'BETWEEN "O"."start_time" AND "O"."end_time"' + ' OR ' +
				"('" + requested_start_time + "'" + ' <= "O"."start_time" AND ' + "'" +  requested_end_time + "'" + ' > "O"."start_time"))' +
				'WHERE "L"."id" IN (' + location.toString() + ') AND ' + '"R"."min_capacity" <= ? ' + 'AND "R"."max_capacity" >= ? AND "F"."id" IN (' +
				facility.toString() + ') AND "P"."id"= ?' ;

	models.sequelize.query(query, {replacements:[req.body.dateValue, req.body.capacity, req.body.capacity, req.body.purpose]})
	  .then(function(result) {
		  res.json(result[0]);
	  });
});


module.exports = router;
