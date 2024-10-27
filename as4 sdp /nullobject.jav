
interface Logger {
    void log(String message);
}

class ConsoleLogger implements Logger {
    public void log(String message) {
        System.out.println("Logging message: " + message);
    }
}

class NullLogger implements Logger {
    public void log(String message) {
    }
}

class Application {
    private Logger logger;
    
    public Application(Logger logger) {
        this.logger = logger;
    }
    
    public void process() {
        logger.log("Processing started");
        logger.log("Processing finished");
    }
}


public class NullObjectPatternDemo {
    public static void main(String[] args) {
        Application appWithLogger = new Application(new ConsoleLogger());
        appWithLogger.process();
        
        Application appWithNullLogger = new Application(new NullLogger());
        appWithNullLogger.process(); 
    }
}
