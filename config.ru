# # @see https://github.com/puma/puma-dev/issues/140#issuecomment-422575346

# Working with root based configuration
use Rack::Static,
  :urls => ["/assets", "/search", "/images", "/js", "/css", "/public", "/meetings"], # Directories to serve
  # "/assets",
  :root => "public",
  :index => "index.html"
  # :root => "./"



run lambda { |env|
  # 'Cache-Control' => 'public, max-age=86400'
  section_name = env['REQUEST_PATH']
  print("Display " + "public" + section_name + "/index.html")
  
  # print env print("LAMBDA RUN...")
  # print(env)
  [
    200,
    {
      'Content-Type'  => 'text/html'  
    },
    File.open('public' + section_name + '/index.html', File::RDONLY)
  ]
}