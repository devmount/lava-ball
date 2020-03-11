export default {
	1: {
		x:5, y:5,
		blocked: [{x:2,y:2},{x:2,y:3},{x:2,y:4},{x:2,y:5},{x:4,y:1},{x:4,y:2},{x:4,y:3},{x:4,y:4}],
		background: [],
		trap: [{x:1,y:4}],
		start: {x:0,y:5},
		target: {x:5,y:1}
	},
	2: {
		x:7, y:7,
		blocked: [{x:1,y:2},{x:3,y:3},{x:4,y:2},{x:6,y:1},{x:6,y:4},{x:5,y:6},{x:2,y:7},{x:7,y:3},{x:7,y:7},{x:1,y:5}],
		background: [{x:8,y:8}],
		trap: [{x:4,y:3},{x:6,y:5}],
		start: {x:1,y:0},
		target: {x:6,y:6}
	},
	3: {
		x:10, y:10,
		blocked: [{x:1,y:1},{x:1,y:2},{x:2,y:1},{x:4,y:4},{x:5,y:4},{x:4,y:5},{x:6,y:4},{x:4,y:6},{x:5,y:5},{x:6,y:5},{x:5,y:6},{x:6,y:6},{x:8,y:2},{x:8,y:3},{x:9,y:3},{x:10,y:10}],
		background: [{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:5,y:5},{x:11,y:11}],
		trap: [],
		start: {x:0,y:10},
		target: {x:9,y:2}
	},
}
