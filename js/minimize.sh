#!/bin/sh
java -jar ../build/tools/closure-compiler-v1346.jar --js libs/bootstrap/carousel.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file min/carousel.js
java -jar ../build/tools/closure-compiler-v1346.jar --js libs/bootstrap/transition.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file min/transition.js
java -jar ../build/tools/closure-compiler-v1346.jar --js libs/bootstrap/tooltip.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file min/tooltip.js
java -jar ../build/tools/closure-compiler-v1346.jar --js libs/bootstrap/popover.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file min/popover.js
java -jar ../build/tools/closure-compiler-v1346.jar --js ../fancybox/helpers/jquery.fancybox-media.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file min/jquery.fancybox-media.js
java -jar ../build/tools/closure-compiler-v1346.jar --js ../fancybox/helpers/jquery.fancybox-thumbs.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file min/jquery.fancybox-thumbs.js
java -jar ../build/tools/closure-compiler-v1346.jar --js script.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file min/script.js


