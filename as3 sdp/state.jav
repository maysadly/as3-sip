interface State {
    void handleRequest();
}

class FanOffState implements State {
    public void handleRequest() {
        System.out.println("Fan is now OFF.");
    }
}

class FanLowState implements State {
    public void handleRequest() {
        System.out.println("Fan is now on LOW speed.");
    }
}

class FanHighState implements State {
    public void handleRequest() {
        System.out.println("Fan is now on HIGH speed.");
    }
}

class Fan {
    private State fanOff;
    private State fanLow;
    private State fanHigh;
    private State currentState;
    
    public Fan() {
        fanOff = new FanOffState();
        fanLow = new FanLowState();
        fanHigh = new FanHighState();
        currentState = fanOff;
    }
    
    public void setState(State state) {
        currentState = state;
    }
    
    public void turnOnLow() {
        setState(fanLow);
        currentState.handleRequest();
    }
    
    public void turnOnHigh() {
        setState(fanHigh);
        currentState.handleRequest();
    }
    
    public void turnOff() {
        setState(fanOff);
        currentState.handleRequest();
    }
}

public class StatePatternDemo {
    public static void main(String[] args) {
        Fan fan = new Fan();
        
        fan.turnOnLow();
        fan.turnOnHigh();
        fan.turnOff();
    }
}
