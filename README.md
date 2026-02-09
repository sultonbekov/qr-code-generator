# QR Code Generator

Простой скрипт для генерации QR-кодов из ссылок и текста.

## Установка

1. Установите зависимости:
```bash
pip install -r requirements.txt
```

## Использование

### Базовое использование
```bash
python qr_generator.py "https://example.com"
```

### С указанием имени файла
```bash
python qr_generator.py "https://example.com" -f my_qr_code.png
```

### Дополнительные параметры
```bash
python qr_generator.py "https://example.com" \
  -f custom_qr.png \
  -s 15 \
  -b 2 \
  --fill-color blue \
  --back-color yellow
```

## Параметры

- `url` - URL или текст для кодирования (обязательно)
- `-f, --filename` - Имя выходного файла (необязательно)
- `-s, --size` - Размер QR-кода (по умолчанию: 10)
- `-b, --border` - Размер рамки (по умолчанию: 4)
- `--fill-color` - Цвет QR-кода (по умолчанию: black)
- `--back-color` - Цвет фона (по умолчанию: white)

## Примеры

Сгенерировать QR-код для сайта:
```bash
python qr_generator.py "https://github.com"
```

Сгенерировать QR-код для текста:
```bash
python qr_generator.py "Hello, World!"
```

Сгенерировать цветной QR-код:
```bash
python qr_generator.py "https://example.com" --fill-color red --back-color lightblue
```
