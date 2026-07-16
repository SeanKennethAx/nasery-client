export function useOrganizers() {
	return useState('admin-organizers', () => [
		{
			id: 'eventpro-solutions',
			name: 'EventPro Solutions',
			email: 'contact@eventprosolutions.ph',
			phone: '+63 917 555 0142',
			location: 'Quezon City, Metro Manila',
			joined: 'Jan 12, 2025',
			status: 'Active',
			rating: 4.8,
			events: [
				{ title: 'STI College Intramurals 2026', client: 'STI College Quezon City', date: 'Aug 14, 2026', venue: 'STI QC Gymnasium', status: 'Upcoming', ticketsSold: 420, capacity: 500, revenue: 840000 },
				{ title: 'Ayala Corp Year-End Gala', client: 'Ayala Corporation', date: 'Dec 5, 2025', venue: 'Shangri-La Makati', status: 'Completed', ticketsSold: 300, capacity: 300, revenue: 1200000 },
				{ title: 'Unilab Wellness Fun Run', client: 'Unilab Inc.', date: 'Mar 22, 2026', venue: 'Bonifacio Global City', status: 'Upcoming', ticketsSold: 850, capacity: 1000, revenue: 360000 }
			]
		},
		{
			id: 'santos-events-co',
			name: 'Santos Events Co.',
			email: 'hello@santosevents.ph',
			phone: '+63 917 555 0281',
			location: 'Makati City, Metro Manila',
			joined: 'Mar 4, 2025',
			status: 'Active',
			rating: 4.6,
			events: [
				{ title: 'De La Salle Alumni Homecoming', client: 'DLSU Alumni Association', date: 'Sep 18, 2025', venue: 'DLSU Br. Andrew Gonzalez Hall', status: 'Completed', ticketsSold: 600, capacity: 600, revenue: 900000 },
				{ title: 'Globe Telecom Town Hall', client: 'Globe Telecom', date: 'Nov 2, 2025', venue: 'Globe Tower, Taguig', status: 'Completed', ticketsSold: 450, capacity: 450, revenue: 675000 },
				{ title: 'Robinsons Land Anniversary Ball', client: 'Robinsons Land Corp', date: 'Feb 14, 2026', venue: 'Dusit Thani Manila', status: 'Upcoming', ticketsSold: 380, capacity: 500, revenue: 950000 },
				{ title: 'Cebu Pacific Crew Appreciation Night', client: 'Cebu Pacific Air', date: 'Jun 30, 2026', venue: 'Marriott Hotel Manila', status: 'Upcoming', ticketsSold: 300, capacity: 300, revenue: 575000 }
			]
		},
		{
			id: 'grand-occasions-ph',
			name: 'Grand Occasions PH',
			email: 'info@grandoccasions.ph',
			phone: '+63 917 555 0399',
			location: 'Cebu City, Cebu',
			joined: 'May 20, 2025',
			status: 'Active',
			rating: 4.3,
			events: [
				{ title: 'Cebu Business Summit 2026', client: 'Cebu Chamber of Commerce', date: 'Apr 10, 2026', venue: 'Waterfront Cebu City Hotel', status: 'Upcoming', ticketsSold: 250, capacity: 300, revenue: 500000 },
				{ title: 'Metrobank Foundation Awards Night', client: 'Metrobank Foundation', date: 'Oct 8, 2025', venue: 'Manila Peninsula', status: 'Completed', ticketsSold: 200, capacity: 200, revenue: 400000 },
				{ title: 'SM Prime Holdings Leadership Forum', client: 'SM Prime Holdings', date: 'Jan 25, 2026', venue: 'SMX Convention Center', status: 'Upcoming', ticketsSold: 180, capacity: 250, revenue: 300000 }
			]
		},
		{
			id: 'premier-planners-davao',
			name: 'Premier Planners Davao',
			email: 'admin@premierplanners.ph',
			phone: '+63 917 555 0456',
			location: 'Davao City, Davao del Sur',
			joined: 'Jul 9, 2025',
			status: 'Suspended',
			rating: 4.1,
			events: [
				{ title: 'Davao Agri-Trade Expo', client: 'Davao City Chamber of Commerce', date: 'May 15, 2025', venue: 'SMX Davao', status: 'Completed', ticketsSold: 300, capacity: 300, revenue: 450000 },
				{ title: 'Kadayawan Business Mixer', client: 'Kadayawan Festival Committee', date: 'Aug 20, 2025', venue: 'Marco Polo Davao', status: 'Completed', ticketsSold: 150, capacity: 150, revenue: 200000 }
			]
		},
		{
			id: 'fiesta-makers-inc',
			name: 'Fiesta Makers Inc.',
			email: 'team@fiestamakers.ph',
			phone: '+63 917 555 0623',
			location: 'Iloilo City, Iloilo',
			joined: 'Sep 2, 2025',
			status: 'Active',
			rating: 4.7,
			events: [
				{ title: 'Iloilo Dinagyang Sponsor Gala', client: 'Dinagyang Foundation', date: 'Jan 20, 2026', venue: 'Iloilo Convention Center', status: 'Upcoming', ticketsSold: 400, capacity: 400, revenue: 800000 },
				{ title: 'Bacolod MassKara Business Forum', client: 'Bacolod City Government', date: 'Oct 15, 2025', venue: 'SMX Bacolod', status: 'Completed', ticketsSold: 350, capacity: 400, revenue: 700000 },
				{ title: 'Negros Sugar Industry Awards', client: 'Negros Sugar Millers Association', date: 'Mar 3, 2026', venue: "L'Fisher Hotel Bacolod", status: 'Upcoming', ticketsSold: 200, capacity: 200, revenue: 400000 }
			]
		},
		{
			id: 'metro-weddings-events',
			name: 'Metro Weddings & Events',
			email: 'hello@metroweddings.ph',
			phone: '+63 918 222 3344',
			location: 'Pasig City, Metro Manila',
			joined: 'Jul 10, 2026',
			status: 'Pending',
			rating: 0,
			events: []
		},
		{
			id: 'cavite-fiesta-crew',
			name: 'Cavite Fiesta Crew',
			email: 'info@cavitefiestacrew.ph',
			phone: '+63 920 555 7788',
			location: 'Dasmarinas, Cavite',
			joined: 'Jul 14, 2026',
			status: 'Pending',
			rating: 0,
			events: []
		}
	])
}

export function organizerRevenue(organizer) {
	return organizer.events.reduce((sum, event) => sum + event.revenue, 0)
}

export function organizerClients(organizer) {
	return [...new Set(organizer.events.map((event) => event.client))]
}

export function formatCurrency(amount) {
	if (amount >= 1000000) return `₱${(amount / 1000000).toFixed(1)}M`
	if (amount >= 1000) return `₱${(amount / 1000).toFixed(0)}K`
	return `₱${amount}`
}
