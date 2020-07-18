echo "running tests";
nyc mocha --recursive; 
testStatus=$?;
if [ $testStatus == 0 ]; then
  echo "\n pushing code"
  exit 0;

else 
echo "\n error detected ..."
  exit 1;
fi