import java.util.ArrayList;
import java.util.List;

interface Subject {
    void registerObserver(Observer o);
    void removeObserver(Observer o);
    void notifyObservers();
}

interface Observer {
    void update(float temperature, float humidity);
}

class WeatherStation implements Subject {
    private List<Observer> observers;
    private float temperature;
    private float humidity;
    
    public WeatherStation() {
        observers = new ArrayList<>();
    }
    
    public void registerObserver(Observer o) {
        observers.add(o);
    }
    
    public void removeObserver(Observer o) {
        observers.remove(o);
    }
    
    public void notifyObservers() {
        for (Observer o : observers) {
            o.update(temperature, humidity);
        }
    }
    
    public void setWeatherData(float temperature, float humidity) {
        this.temperature = temperature;
        this.humidity = humidity;
        notifyObservers();
    }
}

class DisplayScreen implements Observer {
    private String displayName;
    
    public DisplayScreen(String displayName) {
        this.displayName = displayName;
    }
    
    public void update(float temperature, float humidity) {
        System.out.println(displayName + " - Temperature: " + temperature + ", Humidity: " + humidity);
    }
}

public class ObserverPatternDemo {
    public static void main(String[] args) {
        WeatherStation station = new WeatherStation();
        DisplayScreen screen1 = new DisplayScreen("Screen 1");
        DisplayScreen screen2 = new DisplayScreen("Screen 2");
        
        station.registerObserver(screen1);
        station.registerObserver(screen2);
        
        station.setWeatherData(30.5f, 65.0f);
        station.setWeatherData(28.0f, 70.0f);
    }
}
