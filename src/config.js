const CONFIG = {
	"ROLES": {
		"ADMIN": "admin",
		"PATIENT": "ind",
		"HEALTH_PROFESSIONAL": "pro",
		"HEALTH_FACILITY": "clinic",
		"ORGANIZATION": "org",
	},
	"ROLE_KEYS": {
		"admin": "ADMIN",
		"ind": "PATIENT",
		"pro": "HEALTH_PROFESSIONAL",
		"clinic": "HEALTH_FACILITY",
		"org": "ORGANIZATION"
	},
	"JITSI_HOST": "jitsi.monitormyrehab.com",
	"ROLES_ARRAY": ["admin", "ind", "pro", "org", "clinic"],
	"PARENT_ACCOUNT_ROLES_ARRAY": ["pro", "org", "clinic"],
	"APP_HOST": process.env.NODE_ENV === "production" ? "https://app.monitormyrehab.com/" : "http://localhost:3000/",
	"API_HOST": process.env.NODE_ENV === "production" ? "https://api.monitormyrehab.com/" : "https://api.monitormyrehab.com/"
}

export default CONFIG;