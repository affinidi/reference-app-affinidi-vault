  namespace Affinidi_Login_Demo_App;
  public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(config =>
                {
                    config.UseStartup<Startup>();
                });

    }
