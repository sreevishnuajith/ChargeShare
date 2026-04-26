# ChargeShare Wireframes (Low Fidelity)

These are low-fidelity wireframes for Phase 1 planning.

## 1. Screen Map

```text
[Login] -> [Resident Dashboard] -> [Book Charger]
                  |                   |
                  |                   -> [Booking Confirmation]
                  |
                  -> [My Sessions]
                  -> [My Invoices]

[Admin Login] -> [Admin Dashboard] -> [Utilisation Reports]
                                   -> [Billing Reports]
```

## 2. Login Screen

```text
+---------------------------------------------------+
| ChargeShare                                       |
| Fair EV charging in shared buildings              |
|---------------------------------------------------|
| Email:       [______________________________]     |
| Password:    [______________________________]     |
| [ Login ]                      [ Register ]       |
|---------------------------------------------------|
| Forgot password?                                  |
+---------------------------------------------------+
```

## 3. Resident Dashboard

```text
+---------------------------------------------------+
| Top Nav: Dashboard | Book | Sessions | Invoices   |
|---------------------------------------------------|
| Welcome, <Resident Name>                          |
| Next Booking: Charger A2, 6:00 PM - 7:30 PM       |
|---------------------------------------------------|
| Available Chargers Today                          |
| [A1: Free] [A2: Busy] [B1: Free]                  |
|---------------------------------------------------|
| Quick Actions                                     |
| [Book a Charger] [View Usage] [View Invoices]     |
+---------------------------------------------------+
```

## 4. Booking Screen

```text
+---------------------------------------------------+
| Top Nav: Dashboard | Book | Sessions | Invoices   |
|---------------------------------------------------|
| Select Charger: [A1 v]                            |
| Date:           [ 2026-05-10 ]                    |
| Start Time:     [ 18:00 ]                         |
| End Time:       [ 19:30 ]                         |
|---------------------------------------------------|
| Calendar Availability                             |
| [ 5PM ] [ 6PM ] [ 7PM ] [ 8PM ]                   |
|   Free    Free   Busy    Free                     |
|---------------------------------------------------|
| Estimated Cost: $4.20                             |
| [Confirm Booking]                                 |
+---------------------------------------------------+
```

## 5. Sessions Screen

```text
+---------------------------------------------------+
| Top Nav: Dashboard | Book | Sessions | Invoices   |
|---------------------------------------------------|
| My Charging Sessions                              |
|---------------------------------------------------|
| Date       Charger   Duration   kWh   Cost        |
| 10/05      A1        1h 30m     7.2   $4.20       |
| 12/05      B1        1h 00m     4.8   $2.80       |
|---------------------------------------------------|
| Total This Month: 25.4 kWh | $14.90               |
+---------------------------------------------------+
```

## 6. Invoices Screen

```text
+---------------------------------------------------+
| Top Nav: Dashboard | Book | Sessions | Invoices   |
|---------------------------------------------------|
| Invoices                                           |
|---------------------------------------------------|
| Period            Status      Amount   Action      |
| Apr 2026          SENT        $22.40   [View PDF]  |
| May 2026 (to date) DRAFT      $14.90   [Preview]   |
|---------------------------------------------------|
| [Email Me Latest Invoice]                          |
+---------------------------------------------------+
```

## 7. Admin Dashboard

```text
+---------------------------------------------------+
| Top Nav: Overview | Utilisation | Billing | Users  |
|---------------------------------------------------|
| KPI Cards                                           |
| [Bookings Today] [Utilisation %] [Revenue Month]    |
|---------------------------------------------------|
| Charger Utilisation Chart                           |
| [Bar Chart Placeholder]                             |
|---------------------------------------------------|
| Peak Usage Heatmap                                  |
| [Heatmap Placeholder]                               |
|---------------------------------------------------|
| Alerts: Overstay incidents, frequent conflicts      |
+---------------------------------------------------+
```

## 8. Wireframe Notes

- Resident navigation prioritises booking and invoice visibility.
- Admin view is read-focused to reduce accidental changes.
- All screens are designed to collapse to mobile with stacked sections.
- Final high-fidelity visual design can be implemented in Figma using these layouts.
