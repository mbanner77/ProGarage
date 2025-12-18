-- Insert sample properties
INSERT INTO public.properties (id, name, address, city, postal_code, description)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Residenz am Park', 'Parkstraße 15', 'Berlin', '10115', 'Moderne Wohnanlage mit 24 Einheiten'),
  ('22222222-2222-2222-2222-222222222222', 'City Plaza', 'Hauptstraße 42', 'München', '80331', 'Gewerbeimmobilie im Stadtzentrum'),
  ('33333333-3333-3333-3333-333333333333', 'Gartenresidenz', 'Blumenweg 8', 'Hamburg', '20095', 'Familienfreundliche Wohnanlage');

-- Insert sample units
INSERT INTO public.units (property_id, unit_number, floor, size_sqm, rooms, monthly_rent, status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'A101', 1, 65.5, 2, 850.00, 'occupied'),
  ('11111111-1111-1111-1111-111111111111', 'A102', 1, 78.0, 3, 1050.00, 'occupied'),
  ('11111111-1111-1111-1111-111111111111', 'A201', 2, 65.5, 2, 900.00, 'vacant'),
  ('11111111-1111-1111-1111-111111111111', 'A202', 2, 85.0, 3, 1150.00, 'occupied'),
  ('22222222-2222-2222-2222-222222222222', 'B001', 0, 120.0, 4, 2500.00, 'occupied'),
  ('33333333-3333-3333-3333-333333333333', 'C101', 1, 95.0, 4, 1350.00, 'vacant');
