# 🎯 QR Code Generator

<div align="center">
  
![Python](https://img.shields.io/badge/Python-3.6%2B-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)

**Простой и мощный скрипт для генерации QR-кодов из ссылок и текста**

[![GitHub stars](https://img.shields.io/github/stars/sultonbekov/qr-code-generator.svg?style=social&label=Star)](https://github.com/sultonbekov/qr-code-generator)
[![GitHub forks](https://img.shields.io/github/forks/sultonbekov/qr-code-generator.svg?style=social&label=Fork)](https://github.com/sultonbekov/qr-code-generator/fork)
[![GitHub issues](https://img.shields.io/github/issues/sultonbekov/qr-code-generator.svg)](https://github.com/sultonbekov/qr-code-generator/issues)

</div>

---

## ✨ Возможности

<table>
<tr>
<td>🚀 <strong>Быстрая генерация</strong></td>
<td>Создавайте QR-коды из любых URL и текста за секунды</td>
</tr>
<tr>
<td>🎨 <strong>Кастомизация</strong></td>
<td>Настраивайте цвета, размер и рамки по своему вкусу</td>
</tr>
<tr>
<td>📱 <strong>Универсальность</strong></td>
<td>Работает с любым текстом, включая кириллицу</td>
</tr>
<tr>
<td>💾 <strong>Сохранение</strong></td>
<td>Экспортируйте в высококачественном PNG формате</td>
</tr>
<tr>
<td>🌐 <strong>Поддержка Unicode</strong></td>
<td>Полная поддержка кириллицы и других символов</td>
</tr>
</table>

## 🚀 Быстрый старт

### 1. Клонируйте репозиторий
```bash
git clone https://github.com/sultonbekov/qr-code-generator.git
cd qr-code-generator
```

### 2. Создайте виртуальное окружение
```bash
python3 -m venv venv
source venv/bin/activate  # Для Linux/Mac
# или
venv\Scripts\activate     # Для Windows
```

### 3. Установите зависимости
```bash
pip install -r requirements.txt
```

### 4. Сгенерируйте свой первый QR-код
```bash
python qr_generator.py "https://example.com"
```

## 📖 Подробное использование

### Базовая генерация
```bash
# Простая ссылка
python qr_generator.py "https://google.com"

# Текст на русском
python qr_generator.py "Привет, мир!"

# Длинная ссылка
python qr_generator.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

### Продвинутые настройки
```bash
# Кастомное имя файла
python qr_generator.py "https://github.com" -f my_github_qr.png

# Изменение размера и цветов
python qr_generator.py "https://example.com" \
  -s 20 \
  -b 5 \
  --fill-color "#FF5733" \
  --back-color "#F0F0F0"

# Минималистичный стиль
python qr_generator.py "текст" -s 8 -b 2 --fill-color black --back-color white
```

## 🎨 Параметры командной строки

| Параметр | Описание | По умолчанию |
|----------|----------|--------------|
| `url` | URL или текст для кодирования | **(обязательно)** |
| `-f, --filename` | Имя выходного файла | Автоматически |
| `-s, --size` | Размер QR-кода (в пикселях) | `10` |
| `-b, --border` | Размер рамки | `4` |
| `--fill-color` | Цвет QR-кода | `black` |
| `--back-color` | Цвет фона | `white` |

## 💡 Примеры использования

### Для сайта
```bash
python qr_generator.py "https://vk.com" -f vk_qr.png
```
*Создаст QR-код для страницы ВКонтакте*

### Для соцсетей
```bash
python qr_generator.py "https://instagram.com/username" --fill-color purple --back-color "#FFE4E1"
```
*Создаст красивый QR-код для Instagram*

### Для контакта
```bash
python qr_generator.py "+7 (999) 123-45-67" -f contact_qr.png
```
*Создаст QR-код с номером телефона*

### Для Wi-Fi
```bash
python qr_generator.py "WIFI:T:WPA;S:MyNetwork;P:MyPassword;;" -f wifi_qr.png
```
*Создаст QR-код для быстрого подключения к Wi-Fi*

## 🔧 Программное использование

```python
from qr_generator import generate_qr_code

# Базовый пример
generate_qr_code("https://example.com", "example.png")

# Продвинутый пример
generate_qr_code(
    url="Ваш текст здесь",
    filename="custom.png",
    size=15,
    border=3,
    fill_color="blue",
    back_color="lightgray"
)
```

## 📁 Структура проекта

```
qr-code-generator/
├── qr_generator.py    # Основной скрипт
├── example.py         # Примеры использования
├── requirements.txt   # Зависимости Python
├── README.md         # Документация
├── .gitignore        # Исключения для Git
└── venv/             # Виртуальное окружение
```

## 🛠️ Установка зависимостей

Скрипт использует следующие библиотеки:
- `qrcode[pil]` - для генерации QR-кодов
- `Pillow` - для работы с изображениями

Установите их командой:
```bash
pip install -r requirements.txt
```

## 🎯 Советы по использованию

<div align="center">

```bash
# 🎨 Оптимальные параметры для лучшего качества
python qr_generator.py "https://example.com" -s 15 -b 4 --fill-color "#2C3E50" --back-color "#ECF0F1"
```

</div>

<table>
<tr>
<td>💡 <strong>Размер</strong></td>
<td>Используйте <code>size=10-20</code> для оптимального качества сканирования</td>
</tr>
<tr>
<td>🎨 <strong>Цвета</strong></td>
<td>Обеспечьте контрастность между QR-кодом и фоном для лучшего распознавания</td>
</tr>
<tr>
<td>📁 <strong>Формат</strong></td>
<td>Используйте <code>.png</code> расширение для максимального качества</td>
</tr>
<tr>
<td>🌍 <strong>Текст</strong></td>
<td>Поддерживается кириллица и любые Unicode символы</td>
</tr>
</table>

## 📱 Где использовать QR-коды?

<div align="center">

| 📋 Визитки | 🌐 Сайты | 📶 Wi-Fi | 💬 Мессенджеры |
|------------|----------|----------|----------------|
| 📧 Email | 📍 Адреса | 🎫 Билеты | � Приложения |

</div>

- **📋 Визитки** - контактная информация
- **🌐 Сайты** - быстрые ссылки на ресурсы  
- **📶 Wi-Fi** - автоматическое подключение
- **💬 Мессенджеры** - ссылки на чаты
- **📧 Email** - быстрая отправка писем
- **📍 Адреса** - навигация в картах
- **🎫 Билеты** - электронные билеты
- **📱 Приложения** - ссылки на скачивание

## 🤝 Вклад в проект

1. Fork этого репозитория
2. Создайте свою ветку (`git checkout -b feature/AmazingFeature`)
3. Commit ваши изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. Подробности в файле LICENSE.

## ⭐ Поддержка проекта

<div align="center">

Если этот проект был вам полезен:

[![GitHub stars](https://img.shields.io/github/stars/sultonbekov/qr-code-generator.svg?style=social&label=Star&maxAge=2592000)](https://github.com/sultonbekov/qr-code-generator)
[![GitHub forks](https://img.shields.io/github/forks/sultonbekov/qr-code-generator.svg?style=social&label=Fork&maxAge=2592000)](https://github.com/sultonbekov/qr-code-generator/fork)

Поставьте ⭐ и поделитесь с друзьями!

</div>

---

<div align="center">

**🎯 Создавайте QR-коды легко и быстро!**

[🔝 Наверх](#-qr-code-generator)

</div>
