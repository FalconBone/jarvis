from fastapi import FastAPI
from fastapi.responses import FileResponse
from silero import silero_tts
import scipy.io.wavfile as wav
import numpy as np
import torch
import cyrtranslit
import re
from num2words import num2words
from pydantic import BaseModel
import os
import uuid

class TextToSpeach(BaseModel):
    text: str

app = FastAPI()

# Инициализация модели (один раз при запуске)
model, _ = silero_tts(language='ru', speaker='v5_ru')

def normalize_numbers(text):
    text = re.sub(r'(\d+)%', lambda m: f"{num2words(int(m.group(1)), lang='ru')} процентов", text)
    text = re.sub(r'\b(\d+)\b', lambda m: num2words(int(m.group(1)), lang='ru'), text)
    return text

def process_text(text: str) -> str:
    # Транслитерация латиницы
    words = text.split()
    processed_words = []
    for word in words:
        if any(c.isascii() and c.isalpha() for c in word):
            # Если слово содержит латиницу, транслитерируем
            processed_words.append(cyrtranslit.to_cyrillic(word, "ru"))
        else:
            processed_words.append(word)
    
    text = ' '.join(processed_words)
    text = normalize_numbers(text)
    return text

@app.post("/tts")
async def text_to_speach(request: TextToSpeach):
    # Обработка текста
    processed_text = process_text(request.text)
    
    # Генерация аудио
    audio = model.apply_tts(
        text=processed_text,
        speaker='aidar',
        sample_rate=48000,
        put_accent=True,
        put_yo=True
    )
    
    # Конвертация в numpy
    if torch.is_tensor(audio):
        audio_numpy = audio.numpy()
    else:
        audio_numpy = audio
    
    # Ускорение
    speed_factor = 1.2
    new_sample_rate = int(48000 * speed_factor)
    
    # Создание временного файла с уникальным именем
    filename = f"temp_{uuid.uuid4()}.wav"
    wav.write(filename, new_sample_rate, (audio_numpy * 32767).astype(np.int16))
    
    # Отправка файла и удаление после отправки
    return FileResponse(
        filename, 
        media_type="audio/wav", 
        filename="speech.wav",
        headers={"Content-Disposition": "attachment; filename=speech.wav"}
    )