#! /bin/bash

# Check output of life_seq on 20x20 test input.

echo "Running sequential version..."

for g in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
	echo "  $g generations..."
	./life_seq 'in/testin2.dat' $g > out/testin2_${g}_seq.out
done
echo "done"

echo "Comparing with oracle..."

failures=0
for g in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
	echo "$g generations:"
	# Use -b option to ignore horizontal whitespace differences
	diff -b out/testin2_${g}.out out/testin2_${g}_seq.out
	if [ $? -ne 0 ]; then
		failures=$(expr $failures + 1)
	fi
done

if [ $failures -eq 0 ]; then
	echo "No failures...sequential output looks good!"
else
	echo "$g/20 test outputs didn't match the expected output"
fi
