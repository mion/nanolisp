def main(argv)
  puts "Lisp Version 0.0.1"
  puts "Press Ctrl+C to exit\n"

  while true
    print "> "
    input = gets.chomp
    print "echo: #{input}\n"
  end
end

main(ARGV)