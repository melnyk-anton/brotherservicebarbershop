-- ============================================
-- Brother Service — Seed Data
-- ============================================

-- Staff / Barbers
INSERT INTO barbers (name, title, sort_order) VALUES
  ('Артем',      'Brand Father',        1),
  ('Микита',     'Brand Master',        2),
  ('Віталій',    'Brand Master',        3),
  ('Віталій',    'Mexico Maestro Bro',  4),
  ('Діма',       'Junior Bro',          5),
  ('Артем',      'Junior Bro',          6),
  ('Таня',       'Junior Sister',       7),
  ('Костянтин',  'Масажист',            8);

-- ============================================
-- Services
-- ============================================

-- Category: main (Основні послуги)
INSERT INTO services (name, category, duration_minutes, price_uah, sort_order) VALUES
  ('Стрижка (машинка + ножиці)',                 'main',      60,  500,  1),
  ('Коротка стрижка (зверху машинкою + фейд)',   'main',      40,  450,  2),
  ('Подовжена / креативна стрижка',              'main',      75,  600,  3),
  ('Стрижка під 1–2 насадки',                    'main',      30,  250,  4),
  ('Дитяча стрижка (до 10 років)',               'main',      50,  350,  5),
  ('Дитяча стрижка ножицями',                    'main',      60,  450,  6);

-- Category: beard (Борода)
INSERT INTO services (name, category, duration_minutes, price_uah, sort_order) VALUES
  ('Борода 1 (Повна, царська, хіпстерська)',     'beard',     45,  300,  7),
  ('Борода 2 (Класична, голлівудська, ділова)',   'beard',     40,  250,  8),
  ('Гоління голови (шейвер / бритва)',           'beard',     30,  350,  9),
  ('Гоління обличчя',                            'beard',     30,  450, 10);

-- Category: combo (Комбо)
INSERT INTO services (name, category, duration_minutes, price_uah, sort_order) VALUES
  ('Комбо 1 (Стрижка + борода)',                 'combo',     90,  700, 11),
  ('Комбо 2 (Коротка стрижка + борода)',         'combo',     80,  600, 12);

-- Category: additional (Додаткові послуги)
INSERT INTO services (name, category, duration_minutes, price_uah, sort_order) VALUES
  ('Епіляція (1 зона)',                          'additional',  5,   50, 13),
  ('2–3 Епіляції',                               'additional',  5,  100, 14),
  ('4 Епіляції',                                 'additional',  5,  150, 15),
  ('Укладка на свято',                           'additional', 15,  350, 16),
  ('Камуфлювання сивини (борода)',               'additional', 25,  500, 17),
  ('Камуфлювання сивини (голова)',               'additional', 30,  600, 18),
  ('Догляд за обличчям',                         'additional', 25,  500, 19),
  ('Пілінг шкіри голови',                        'additional',  5,  100, 20),
  ('Окантовка',                                  'additional', 15,  300, 21),
  ('Масаж обличчя (скраб / креми)',              'additional', 15,  200, 22),
  ('Фарбування волосся (чорний / короткі)',      'additional', 50,  700, 23),
  ('Фарбування волосся (чорний / подовжені)',    'additional', 60, 1000, 24),
  ('Фарбування волосся (інші кольори)',          'additional', 90, 1300, 25),
  ('Мілірування волосся (шапочка)',              'additional', 90, 1500, 26);

-- Category: trainee (Стрижки Стажера)
INSERT INTO services (name, category, duration_minutes, price_uah, sort_order) VALUES
  ('Стрижка (стажер)',                           'trainee',   70,  200, 27),
  ('Комбо 1 (стажер)',                           'trainee',  100,  300, 28),
  ('Комбо 2 (стажер)',                           'trainee',   90,  250, 29),
  ('Борода 1 (стажер)',                          'trainee',  120,  200, 30),
  ('Борода 2 (стажер)',                          'trainee',   45,  150, 31),
  ('Коротка стрижка (стажер)',                   'trainee',   55,  150, 32),
  ('Дитяча стрижка (стажер)',                    'trainee',   50,  150, 33);

-- Category: massage (Масаж)
INSERT INTO services (name, category, duration_minutes, price_uah, sort_order) VALUES
  ('Класичний / спортивний масаж (все тіло)',    'massage',  60,  600,  34),
  ('Масаж спини та шиї',                         'massage',  40,  450,  35),
  ('Тейпування',                                 'massage',  15,  100,  36),
  ('Біозавивка',                                 'massage', 180, 2500,  37),
  ('Масаж на виїзді (вдома / сауна)',            'massage',  65, 1500,  38);
