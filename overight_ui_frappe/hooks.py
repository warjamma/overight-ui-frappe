app_name = "overight_ui_frappe"
app_title = "Overight UI Frappe"
app_publisher = "Muqeet Mughal"
app_description = "Frappe Theme"
app_email = "muqeetmughal786@gmail.com"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "overight_ui_frappe",
# 		"logo": "/assets/overight_ui_frappe/logo.png",
# 		"title": "Overight UI Frappe",
# 		"route": "/overight_ui_frappe",
# 		"has_permission": "overight_ui_frappe.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_css = [
    "/assets/overight_ui_frappe/css/infintrix_erp.css",
    "/assets/overight_ui_frappe/css/infintrix_light.css",
    "/assets/overight_ui_frappe/css/infintrix_dark.css",
    "/assets/overight_ui_frappe/css/top_menu.css",
    "/assets/overight_ui_frappe/css/ui/checkboxes/checkboxes.css",
    "/assets/overight_ui_frappe/css/ui/dropdowns/dropdowns.css",
    "/assets/overight_ui_frappe/css/ui/forms/forms.css",
    "/assets/overight_ui_frappe/css/ui/list-view/list-view.css",
    "/assets/overight_ui_frappe/css/ui/modals/modals.css",
    "/assets/overight_ui_frappe/css/ui/multiselect/multiselect.css",
    "/assets/overight_ui_frappe/css/ui/page-shell/page-shell.css",
]

app_include_js = [
    "/assets/overight_ui_frappe/js/infintrix_erp.js",
    "/assets/overight_ui_frappe/js/top_menu.js",
    # "/assets/overight_ui_frappe/js/sidebar_menu/build/sidebar.js"
    


    #  "/assets/overight_ui_frappe/js/submenu.js",
    #   "/assets/overight_ui_frappe/js/custom-menu/build/menu.js"
]

# include js, css files in header of web template
# web_include_css = "/assets/overight_ui_frappe/css/overight_ui_frappe.css"
# web_include_js = "/assets/overight_ui_frappe/js/overight_ui_frappe.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "overight_ui_frappe/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "overight_ui_frappe/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "overight_ui_frappe.utils.jinja_methods",
# 	"filters": "overight_ui_frappe.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "overight_ui_frappe.install.before_install"
after_install = "overight_ui_frappe.install.after_install"

# Uninstallation
# ------------

before_uninstall = "overight_ui_frappe.install.before_uninstall"
# after_uninstall = "overight_ui_frappe.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "overight_ui_frappe.utils.before_app_install"
# after_app_install = "overight_ui_frappe.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "overight_ui_frappe.utils.before_app_uninstall"
# after_app_uninstall = "overight_ui_frappe.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "overight_ui_frappe.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"overight_ui_frappe.tasks.all"
# 	],
# 	"daily": [
# 		"overight_ui_frappe.tasks.daily"
# 	],
# 	"hourly": [
# 		"overight_ui_frappe.tasks.hourly"
# 	],
# 	"weekly": [
# 		"overight_ui_frappe.tasks.weekly"
# 	],
# 	"monthly": [
# 		"overight_ui_frappe.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "overight_ui_frappe.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "overight_ui_frappe.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "overight_ui_frappe.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["overight_ui_frappe.utils.before_request"]
# after_request = ["overight_ui_frappe.utils.after_request"]

# Job Events
# ----------
# before_job = ["overight_ui_frappe.utils.before_job"]
# after_job = ["overight_ui_frappe.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"overight_ui_frappe.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }
