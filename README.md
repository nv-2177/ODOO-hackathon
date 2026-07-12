# ODOO-hackathon
#SLIDE-0
1. Branding
Company logo
Platform name (TransitOps)
Tagline ("Smart Transport Operations Platform")
Copyright/footer

2. Authentication Form
Email input
Password input (masked)
Role (RBAC) dropdown
Sign In button

3. RBAC (Role-Based Access Control)

Single login supporting multiple roles:

Fleet Manager
Dispatcher
Safety Officer
Financial Analyst

4. Session Management
Remember Me checkbox
Forgot Password link

5. Validation & Error Handling
Invalid credentials message
Account locked after 5 failed attempts
Invalid email validation (expected)
Required field validation (expected)
Wrong password validation
Wrong role selected validation

6. Security Features (Expected)
Password hashing
HTTPS-only authentication
JWT/Session token generation
Token expiration
Secure logout
CSRF protection (if session-based)
Brute-force protection
Rate limiting
Audit logging of login attempts

7. Role-wise Access Information

After login:

Fleet Manager → Fleet, Maintenance
Dispatcher → Dashboard, Trips
Safety Officer → Drivers, Compliance
Financial Analyst → Fuel & Expenses, Analytics

8. UI Features
Split-screen layout
Branding panel on left
Login panel on right
Dark theme
Responsive form
Clear field labels
Accessible button states (hover/disabled/loading)

9. Authentication Flow
User enters email
User enters password
User selects role
Validation
Authentication
RBAC authorization
Redirect to role-specific dashboard

10. Backend Requirements
Users table
Roles table (or role enum)
Login API
Password verification
JWT generation
Role verification
Login history table (optional)
Failed login counter
Account lock mechanism

11. Nice-to-have Features
Show/Hide password
Enter key submits form
Loading spinner during login
Remember last selected role
Multi-factor authentication (MFA)
Password strength policy
Password expiry
Device/session management
Login notifications


#SLIDE - 1
1. Navigation Sidebar
Dashboard
Fleet
Drivers
Trips
Maintenance
Fuel & Expenses
Analytics
Settings
Active menu highlighting

2. Top Navigation Bar
Global search bar
Logged-in user name
User profile/avatar
Current role badge (Dispatcher)
Logout/Profile menu (expected)

3. Filters
Vehicle Type filter
Status filter
Region filter
Reset filters (expected)

4. KPI Cards
Active Vehicles
Available Vehicles
Vehicles in Maintenance
Active Trips
Pending Trips
Drivers on Duty
Fleet Utilization (%)

Expected behavior:

Live updates
Clickable cards
Trend indicators (optional)
Color-coded status

5. Recent Trips Table

Columns:

Trip ID
Vehicle
Driver
Status
ETA

Features:

Sorting
Pagination
Search
View details
Refresh
Status badges

Trip statuses shown:

On Trip
Completed
Dispatched
Draft

6. Vehicle Status Summary

Status distribution:

Available
On Trip
In Shop
Retired

Features:

Progress bars
Percentage/count
Real-time updates

7. Search
Search vehicle
Search driver
Search trip
Instant filtering

8. Role-Based Dashboard

Since the logged-in role is Dispatcher, expected permissions:

View trips
Assign vehicles
Dispatch drivers
View fleet availability
Cannot access finance/admin features

9. Real-Time Features
Auto refresh
Live vehicle status
Trip progress updates
Driver availability updates
Notifications (expected)

10. Backend APIs
Dashboard summary API
Vehicles API
Trips API
Drivers API
Filter API
Search API
Analytics API

11. Database Entities
Users
Vehicles
Drivers
Trips
Maintenance
Fuel Expenses
Regions

12. Dashboard Actions (Expected)
Create Trip
Dispatch Vehicle
Assign Driver
Mark Trip Complete
View Vehicle Details
Schedule Maintenance
Export Reports

13. Notifications (Expected)
Vehicle breakdown
Trip delayed
Maintenance due
Driver unavailable
New trip assigned
Fuel limit exceeded

14. UI Features
Responsive layout
Dark theme
Status color coding
Hover effects
Loading skeletons
Empty states
Error handling

15. Analytics (Expected)
Fleet utilization %
Vehicle availability
Trip completion rate
Driver utilization
Maintenance trends
Fuel consumption trends
Monthly/weekly reports


#SLIDE -2 
1. Navigation Sidebar
Dashboard
Fleet
Drivers
Trips
Maintenance
Fuel & Expenses
Analytics
Settings
Active menu highlighting

2. Top Navigation Bar
Global search bar
Logged-in user name
User profile/avatar
Current role badge (Dispatcher)
Profile/Logout menu (expected)

3. Filters
Vehicle Type filter
Vehicle Status filter
Search by Registration Number
Clear/Reset filters (expected)

4. Add Vehicle
Add Vehicle button
Opens vehicle registration form/modal
Permission based (Fleet Manager/Admin only)

Vehicle form should include:

Registration Number
Vehicle Name
Vehicle Type
Capacity
Odometer Reading
Purchase Cost
Purchase Date
Manufacturer
Model
Fuel Type
Insurance Details
RC Details
Assigned Depot/Region
Status
Save/Cancel

5. Vehicle Registry Table

Columns:

Registration Number
Vehicle Name/Model
Vehicle Type
Capacity
Odometer
Acquisition Cost
Status

Expected additional columns:

Last Service Date
Insurance Expiry
Driver Assigned
Actions

6. Vehicle Status

Status badges:

Available
On Trip
In Shop
Retired

Expected behavior:

Color-coded badges
Status updates in real time
Cannot manually assign invalid status

7. Search
Search by Registration Number
Search by Vehicle Name
Search by Model
Instant search

8. Vehicle Actions (Expected)
View Details
Edit Vehicle
Delete Vehicle
Change Status
Assign Driver
View Maintenance History
View Trip History
Mark as In Shop
Retire Vehicle
Reactivate Vehicle

9. Business Rules

Shown in UI:

Registration Number must be unique.
Retired/In Shop vehicles are hidden from Trip Dispatcher.

Additional expected rules:

Registration number cannot be edited after creation (optional)
Odometer cannot decrease
Only Available vehicles can be dispatched
Retired vehicles are read-only
Vehicle cannot be deleted if trip history exists

10. Validation
Required field validation
Unique Registration Number
Capacity > 0
Odometer ≥ 0
Acquisition Cost ≥ 0
Valid vehicle type
Valid status
Duplicate vehicle prevention

11. Backend APIs
GET /vehicles
GET /vehicles/{id}
POST /vehicles
PUT /vehicles/{id}
DELETE /vehicles/{id}
PATCH /vehicles/status
GET /vehicles/search
GET /vehicles/filter

12. Database Fields
Vehicle ID
Registration Number
Vehicle Name
Model
Manufacturer
Vehicle Type
Capacity
Fuel Type
Odometer
Acquisition Cost
Purchase Date
Status
Driver ID
Depot/Region
Insurance Expiry
RC Expiry
Created At
Updated At

13. Role-Based Access

Fleet Manager

Full CRUD
Change status
Retire vehicles
Assign drivers

Dispatcher

View vehicles
Search/filter
Dispatch only Available vehicles

Safety Officer

View vehicle details
View maintenance records

Financial Analyst

View acquisition cost
View depreciation
Export reports

14. UI Features
Responsive table
Pagination
Sorting on every column
Sticky table header
Hover effects
Loading skeleton
Empty state
Error state

15. Reports & Export (Expected)
Export to CSV
Export to Excel
Print vehicle registry
Filtered report export


17. Notifications (Expected)
Vehicle added successfully
Vehicle updated
Duplicate registration error
Vehicle retired
Vehicle sent for maintenance

## **Slide 3: Drivers & Safety Profiles**

### **1. Navigation Sidebar**

* Dashboard
* Fleet
* Drivers (Active)
* Trips
* Maintenance
* Fuel & Expenses
* Analytics
* Settings

### **2. Top Navigation**

* Global Search
* User Profile
* Role Badge
* Logout/Profile Menu

### **3. Search & Filters**

* Search by Driver Name
* Search by License Number
* Search by Assigned Vehicle
* Filter by Driver Status
* Filter by Safety Status

### **4. Driver Table**

**Columns:**

* Driver Name
* License Number
* Assigned Vehicle
* License Expiry
* Contact Number
* Age
* Driver Status
* Safety Status
* Remarks
* Actions

### **5. Driver Status**

**Supported Statuses:**

* Available
* On Trip
* Off Duty
* Suspended

### **6. Safety Status**

* Valid License
* Expired License
* Suspended
* Under Review (optional)

### **7. Driver Actions**

* Add Driver
* View Driver
* Edit Driver
* Delete Driver
* Update Driver Status
* Update Safety Status
* View Driver History

### **8. Add/Edit Driver Form**

* Driver Name
* License Number
* Assigned Vehicle
* License Expiry Date
* Phone Number
* Age
* Driver Status
* Safety Status
* Remarks
* Save
* Cancel

### **9. Business Rules**

* Expired licenses cannot be dispatched
* Suspended drivers cannot be assigned
* Driver status updates automatically
* License validity checked automatically

### **10. Validation**

* Required fields
* Unique License Number
* Valid Phone Number
* Age > 18
* Future License Expiry Date

### **11. Backend APIs**

* GET /api/drivers
* GET /api/drivers/:id
* POST /api/drivers
* PUT /api/drivers/:id
* DELETE /api/drivers/:id
* PUT /api/drivers/:id/status
* PUT /api/drivers/:id/safety
* GET /api/drivers/search
* GET /api/drivers/filter

### **12. Role Permissions**

**Dispatcher**

* View Drivers
* Assign Drivers

**Fleet Manager**

* Full CRUD

**Safety Officer**

* Update Safety Status
* Suspend Drivers

---

# **Slide 4: Trip Dispatcher**

### **1. Navigation Sidebar**

* Dashboard
* Fleet
* Drivers
* Trips (Active)
* Maintenance
* Fuel & Expenses
* Analytics
* Settings

### **2. Top Navigation**

* Search Trips
* User Profile
* Role Badge

### **3. Filters**

* Trip Status
* Vehicle
* Driver
* Route

### **4. Create Trip Button**

* Opens Trip Creation Form.

### **5. Trip Creation Form**

* Source
* Destination
* Vehicle
* Driver
* Cargo Weight
* Vehicle Capacity
* Estimated Time
* Dispatch Button

### **6. Live Dispatch Board**

**Columns:**

* Trip ID
* Source
* Destination
* Vehicle
* Driver
* Status

### **7. Trip Status**

* Draft
* Dispatched
* On Road
* Completed

### **8. Validation**

* Vehicle Available
* Driver Available
* License Valid
* Cargo Weight ≤ Vehicle Capacity
* Vehicle Not In Shop
* Driver Not Suspended

### **9. Actions**

* Create Trip
* Edit Trip
* Delete Trip
* Dispatch Trip
* Complete Trip
* Cancel Trip

### **10. Business Rules**

* One driver per active trip
* One vehicle per active trip
* Cargo cannot exceed capacity
* Vehicle & Driver status auto-update

### **11. Backend APIs**

* GET /api/trips
* GET /api/trips/:id
* POST /api/trips
* PUT /api/trips/:id
* DELETE /api/trips/:id
* PUT /api/trips/:id/status
* GET /api/trips/live

### **12. Role Permissions**

**Dispatcher**

* Full Trip Management

**Fleet Manager**

* View Trips

**Safety Officer**

* View Trips

---

# **Slide 5: Maintenance**

### **1. Navigation Sidebar**

* Dashboard
* Fleet
* Drivers
* Trips
* Maintenance (Active)
* Fuel & Expenses
* Analytics
* Settings

### **2. Top Navigation**

* Search Vehicle
* User Profile
* Role Badge

### **3. Filters**

* Vehicle Type
* Maintenance Status
* Service Date
* Search Vehicle ID

### **4. Add Maintenance Button**

* Opens Maintenance Form.

### **5. Maintenance Form**

* Vehicle ID
* Vehicle Type
* Issue Description
* Repair Cost
* Service Date
* Additional Notes
* Status
* Save
* Cancel

### **6. Maintenance Table**

**Columns:**

* Vehicle ID
* Vehicle Type
* Issue
* Repair Cost
* Service Date
* Status
* Notes
* Actions

### **7. Vehicle Status**

* Available
* In Shop

### **8. Actions**

* Add Record
* Edit Record
* Delete Record
* Mark In Shop
* Mark Available
* View Service History

### **9. Business Rules**

* Vehicle enters In Shop during maintenance
* In Shop vehicles unavailable for dispatch
* Completing maintenance restores availability
* Service history cannot be deleted

### **10. Validation**

* Vehicle must exist
* Repair Cost ≥ 0
* Service Date required
* Issue Description required

### **11. Backend APIs**

* GET /api/maintenance
* POST /api/maintenance
* PUT /api/maintenance/:id
* DELETE /api/maintenance/:id
* PUT /api/maintenance/:id/status
* GET /api/maintenance/logs

### **12. Role Permissions**

**Fleet Manager**

* Full CRUD

**Dispatcher**

* View Maintenance Status

**Safety Officer**

* View Service History
* Update Maintenance Status
Insurance nearing expiry
Service due reminder
