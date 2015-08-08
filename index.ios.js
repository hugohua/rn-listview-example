/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    AlertIndicatorIOS,
    ActivityIndicatorIOS,
    AlertIOS,
} = React;


var data = (function(){
  var _arr = [];
  for(var i = 0;i <= 100; i++){
    _arr.push({
      "userId" : i,
      "user" : "hugo hua",
      "blog" : "http://www.ghugo.com",
      "github" : "https://github.com/hugohua"
    })
  }
  return _arr;
})()

var stickyId = 3

var RnListviewExample = React.createClass({

    dataBlob : {},
    sectionIDs : [],
    rowIDs : [],

    getInitialState(){
        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        };

        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ':' + rowID];
        };
        return {
            dataSource: new ListView.DataSource({
                getRowData: getRowData,
                getSectionHeaderData: getSectionData,
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2
            })
        }
    },

    componentWillMount(){
        var res = this.listViewHandleData(data);
        console.log(res)
        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(res.dataBlob,res.sectionIDs,res.rowIDs),
            loaded: true
        });
    },

    /**
         * 数据处理
         */
        listViewHandleData(result){
            var me = this,
                dataBlob = {},
                sectionIDs = ['s0','s1'],
                rowIDs = [[],[]],
                key,
                //result = Util.sortResource(data),        //重新排序
                length = result.length,
                splitIdx;

            //将数据分隔成两段
            for(var i = 0;i < length; i++){
                key = result[i]['userId'];
                if(key === stickyId){
                    dataBlob['s1'] = result[i];
                    splitIdx = true;
                }else{
                    if(splitIdx){
                        dataBlob['s1:' + key] = result[i];
                        rowIDs[1].push(key);
                    }else{
                        dataBlob['s0:' + key] = result[i];
                        rowIDs[0].push(key);
                    }

                }
            }
            console.log(dataBlob,sectionIDs,rowIDs);

            return {
                dataBlob : dataBlob,
                sectionIDs : sectionIDs,
                rowIDs : rowIDs
            }
        },


        _renderRow(rowData, sectionID, rowID) {
            return (
                <TouchableOpacity onPress={() => this.onPressRow(rowData, sectionID)}>
                    <View style={styles.rowStyle}>
                        <Text style={styles.rowText}>{rowData.userId}  {rowData.user}</Text>
                    </View>
                </TouchableOpacity>
            );
        },

        onPressRow : function (rowData, sectionID) {
            var buttons = [
                {
                    text : 'Cancel'
                },
                {
                    text    : 'OK'
                }
            ]
            AlertIOS.alert('User\'s Blog is ' + rowData.blog, null, null);
        },

        renderSectionHeader(sectionData, sectionID){
            if(sectionData && sectionData['userId'] === stickyId){
                return (
                  <View style={[styles.rowStyle,{backgroundColor : '#42B7F3'}]}>
                      <Text style={styles.rowText}>{sectionData.userId}  {sectionData.user} ==> {sectionData.blog}</Text>
                  </View>
                )
            }else{
                return <View />
            }
        },

        render: function () {

            return (
              <ListView
                  dataSource={this.state.dataSource}
                  renderRow={(rowData, sectionID, rowID, highlightRow) => this._renderRow(rowData, sectionID, rowID, highlightRow)}
                  renderSectionHeader = {this.renderSectionHeader}
                  />
            );
        }
});

var styles = StyleSheet.create({

    rowStyle: {
        paddingVertical: 20,
        paddingLeft: 16,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1
    }
});

AppRegistry.registerComponent('RnListviewExample', () => RnListviewExample);
