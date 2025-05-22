import pyautogui
import time
import keyboard  # precisa ser instalado: pip install keyboard

print("Pressione 'q' para parar o script.")

try:
    while True:
        if keyboard.is_pressed('q'):
            print("Script encerrado pelo usuário.")
            break

        # Move o mouse ligeiramente para "acordar" o sistema
        x, y = pyautogui.position()
        pyautogui.moveTo(x + 1, y)
        time.sleep(0.1)
        pyautogui.moveTo(x, y)

        # Espera 5 segundos
        time.sleep(5)

except KeyboardInterrupt:
    print("Encerrado manualmente com Ctrl+C.")