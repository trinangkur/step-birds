echo "running tests";
npm test; 
testStatus=$?;
if [ $testStatus == 0 ]; then
  echo "\n pushing code"
  exit 0;

else 
echo "\n error detected ..."
  exit 1;
fi